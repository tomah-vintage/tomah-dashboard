import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SeatingTable } from '$lib/types/seating';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  const userRole = user?.role_name;

  if (userRole === 'admin') {
    throw redirect(303, '/');
  }

  try {
    const tables = await apiFetch<SeatingTable[]>(`${PUBLIC_BACKEND_URL}/api/table/`);
    return { tables };
  } catch (error) {
    console.error('Failed to load seating tables:', error);
    return { tables: [] };
  }
};