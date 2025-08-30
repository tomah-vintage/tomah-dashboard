import type { PageServerLoad } from './$types';
import type { SeatingLayout } from '$lib/types/seating';
import { TableShape, TableStatus } from '$lib/types/seating';

export const load: PageServerLoad = async () => {
  // Mock data for now
  const mockLayout: SeatingLayout = {
    id: 'layout-1',
    restaurantId: 'rest-123',
    name: 'Main Dining Room',
    tables: [
      {
        id: 'table-1',
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        shape: TableShape.Circle,
        capacity: 4,
        label: 'T1',
        status: TableStatus.Available,
      },
      {
        id: 'table-2',
        x: 250,
        y: 150,
        width: 120,
        height: 70,
        shape: TableShape.Rectangle,
        capacity: 6,
        label: 'T2',
        status: TableStatus.Occupied,
      },
    ],
  };

  return {
    layout: mockLayout,
  };
};