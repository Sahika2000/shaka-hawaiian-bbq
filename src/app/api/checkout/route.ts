import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, pickupTimeNote, specialInstructions, items } = body;

    if (!name || !phone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalCents = items.reduce(
      (sum: number, i: any) => sum + i.unitPriceCents * i.quantity,
      0
    );

    // Create customer
    const customer = await prisma.customer.create({
      data: { name, phone },
    });

    // Create order (pending)
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalCents,
        pickupTimeNote: pickupTimeNote || null,
        specialInstructions: specialInstructions || null,
        status: 'pending',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            selectedOption: item.selectedOption || null,
            notes: item.notes || null,
          })),
        },
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.selectedOption
              ? `${item.name} (${item.selectedOption})`
              : item.name,
          },
          unit_amount: item.unitPriceCents,
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
        customerName: name,
      },
      customer_email: undefined,
      success_url: `${siteUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    // Save Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
