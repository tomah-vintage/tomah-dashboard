import type { PageServerLoad } from './$types';
import type { SeatingTable } from '$lib/types/seating';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async () => {
  try {
    const tables = await apiFetch<SeatingTable[]>(`${PUBLIC_BACKEND_URL}/api/table/`);
    return { tables };
  } catch (error) {
    console.error('Failed to load seating tables:', error);
    return { tables: [] };
  }
};