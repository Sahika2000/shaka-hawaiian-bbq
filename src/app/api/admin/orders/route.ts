import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminLoggedIn } from '@/lib/auth';

export async function GET() {
  if (!isAdminLoggedIn()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: true },
    take: 100,
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  if (!isAdminLoggedIn()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId, status } = await req.json();
  const allowed = ['pending', 'paid', 'ready', 'completed', 'cancelled'];

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json(order);
}
