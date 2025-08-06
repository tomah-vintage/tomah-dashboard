import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const { user } = locals;

  if (!user && url.pathname !== '/login') {
    throw redirect(307, '/login');
  }

  return { user };
};
