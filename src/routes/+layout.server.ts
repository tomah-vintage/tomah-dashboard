import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { user } = locals;

  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  if (!user && !publicRoutes.includes(url.pathname)) {
    throw redirect(307, '/login');
  }

  return { user };
};
