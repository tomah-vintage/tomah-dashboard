import { writable } from 'svelte/store';
import type { SeatingLayout, SeatingTable } from '$lib/types/seating';
import { TableShape, TableStatus } from '$lib/types/seating';
import { browser } from '$app/environment';

const STORAGE_KEY = 'seating-layout';

function createSeatingStore() {
  const stored = browser ? sessionStorage.getItem(STORAGE_KEY) : null;
  const initialValue: SeatingLayout | null = stored ? JSON.parse(stored) : null;

  const { subscribe, set, update } = writable<SeatingLayout | null>(initialValue);

  if (browser) {
    subscribe(layout => {
      if (layout) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    });
  }

  return {
    subscribe,
    set,
    moveTable: (tableId: string, newX: number, newY: number) => {
      update(layout => {
        if (!layout) return null;
        const tableIndex = layout.tables.findIndex(t => t.id === tableId);
        if (tableIndex > -1) {
          layout.tables[tableIndex].x = newX;
          layout.tables[tableIndex].y = newY;
        }
        return layout;
      });
    },
    updateTables: (newTables: SeatingTable[]) => {
      update(layout => {
        if (!layout) return null;
        return {
          ...layout,
          tables: newTables
        };
      });
    },
    addTable: (shape: TableShape, capacity: number) => {
      update(layout => {
        if (!layout) return null;
        const newTable: SeatingTable = {
          id: `table-${Date.now()}`,
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          shape: shape,
          capacity: capacity,
          label: `T${layout.tables.length + 1}`,
          status: TableStatus.Available,
        };
        layout.tables = [...layout.tables, newTable];
        return layout;
      });
    },
    updateTable: (tableId: string, shape: TableShape, capacity: number) => {
      update(layout => {
        if (!layout) return null;
        const tableIndex = layout.tables.findIndex(t => t.id === tableId);
        if (tableIndex > -1) {
          layout.tables[tableIndex].shape = shape;
          layout.tables[tableIndex].capacity = capacity;
        }
        return layout;
      });
    },
    removeTable: (tableId: string) => {
      update(layout => {
        if (!layout) return null;
        return {
          ...layout,
          tables: layout.tables.filter(t => t.id !== tableId),
        };
      });
    },
  };
}

export const seatingStore = createSeatingStore();
