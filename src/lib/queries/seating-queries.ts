import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { SeatingTable } from '$lib/types/seating';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import toast from 'svelte-french-toast';

export const createGetTablesQuery = () =>
	createQuery<SeatingTable[], Error>({
		queryKey: ['tables'],
		queryFn: () => apiFetch<SeatingTable[]>(`${PUBLIC_BACKEND_URL}/api/table/`)
	});

export const createAddTableMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<SeatingTable, Error, Omit<SeatingTable, 'id'>>({
		mutationFn: (newTable) =>
			apiFetch<SeatingTable>(`${PUBLIC_BACKEND_URL}/api/table/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTable)
			}),
		onSuccess: () => {
			toast.success('Table added successfully!');
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
		onError: (error) => {
			toast.error(`Error adding table: ${error.message}`);
		}
	});
};

export const createUpdateTableMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<SeatingTable, Error, SeatingTable>({
		mutationFn: (table) =>
			apiFetch<SeatingTable>(`${PUBLIC_BACKEND_URL}/api/table/${table.id}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(table)
			}),
		onSuccess: () => {
			toast.success('Table updated successfully!');
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
		onError: (error) => {
			toast.error(`Error updating table: ${error.message}`);
		}
	});
};

export const createDeleteTableMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, string>({
		mutationFn: (tableId) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/table/${tableId}/`, {
				method: 'DELETE'
			}),
		onSuccess: () => {
			toast.success('Table deleted successfully!');
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
		onError: (error) => {
			toast.error(`Error deleting table: ${error.message}`);
		}
	});
};
