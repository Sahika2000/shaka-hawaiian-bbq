import { prisma } from '@/lib/prisma';
import { MenuClient } from './MenuClient';
import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Menu | Shaka Hawaiian BBQ',
  description: 'Browse our full Hawaiian BBQ menu — Aloha Plates, BBQ Chicken, Kalbi Short Ribs, and more.',
};

export const revalidate = 60;

export default async function MenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { available: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return <MenuClient categories={categories} />;
}
