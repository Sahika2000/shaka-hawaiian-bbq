import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminLoggedIn } from '@/lib/auth';

export async function GET() {
  if (!isAdminLoggedIn()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return NextResponse.json(categories);
}

export async function PATCH(req: NextRequest) {
  if (!isAdminLoggedIn()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId, available, name, basePrice, description } = await req.json();

  const update: Record<string, unknown> = {};
  if (available !== undefined) update.available = available;
  if (name !== undefined) update.name = name;
  if (basePrice !== undefined) update.basePrice = basePrice;
  if (description !== undefined) update.description = description;

  const item = await prisma.menuItem.update({
    where: { id: itemId },
    data: update,
  });

  return NextResponse.json(item);
}
