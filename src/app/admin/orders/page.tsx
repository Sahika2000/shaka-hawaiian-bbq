import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { AdminOrdersClient } from './AdminOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  if (!isAdminLoggedIn()) redirect('/admin/login');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: true },
    take: 100,
  });

  return <AdminOrdersClient orders={orders} />;
}
