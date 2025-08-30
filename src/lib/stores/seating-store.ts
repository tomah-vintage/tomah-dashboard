import { writable } from 'svelte/store';
import type { SeatingTable } from '$lib/types/seating';

interface SeatingStoreState {
  tables: SeatingTable[];
  showTableEditorModal: boolean;
  editingTable: SeatingTable | null;
}

function createSeatingStore() {
  const { subscribe, set, update } = writable<SeatingStoreState>({
    tables: [],
    showTableEditorModal: false,
    editingTable: null,
  });

  return {
    subscribe,
    setTables: (newTables: SeatingTable[]) => update(state => ({ ...state, tables: newTables })),
    moveTable: (tableId: string, newX: number, newY: number) => {
      update(state => {
        const tableIndex = state.tables.findIndex(t => t.id === tableId);
        if (tableIndex > -1) {
          state.tables[tableIndex].x = newX;
          state.tables[tableIndex].y = newY;
        }
        return { ...state, tables: [...state.tables] };
      });
    },
    setEditingTable: (table: SeatingTable | null) => update(state => ({ ...state, editingTable: table })),
    toggleTableEditorModal: (open: boolean) => update(state => ({ ...state, showTableEditorModal: open })),
    clearEditingTable: () => update(state => ({ ...state, editingTable: null })),
  };
}

export const seatingStore = createSeatingStore();
