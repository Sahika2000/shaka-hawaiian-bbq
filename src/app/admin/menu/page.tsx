import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminMenuClient } from './AdminMenuClient';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  if (!isAdminLoggedIn()) redirect('/admin/login');

  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return <AdminMenuClient categories={categories} />;
}
