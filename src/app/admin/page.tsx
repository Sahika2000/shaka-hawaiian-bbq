import { redirect } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/auth';

export default function AdminPage() {
  if (!isAdminLoggedIn()) redirect('/admin/login');
  redirect('/admin/orders');
}
