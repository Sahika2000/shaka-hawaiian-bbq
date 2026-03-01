import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';

export function isAdminLoggedIn(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === process.env.ADMIN_PASSWORD;
}

export { SESSION_COOKIE };
