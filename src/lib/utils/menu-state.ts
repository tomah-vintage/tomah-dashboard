import type { MenuItem } from "$lib/types/menu";

export interface MenuFilters {
  search: string;
  category: string;
  status: boolean | null;
}

export interface MenuTableState {
  selectedItems: number[];
  openMenuId: number | null;
}

export function createMenuState(): MenuTableState {
  return {
    selectedItems: [],
    openMenuId: null,
  };
}

export function toggleItemSelection(state: MenuTableState, itemId: number): MenuTableState {
  const isSelected = state.selectedItems.includes(itemId);
  return {
    ...state,
    selectedItems: isSelected
      ? state.selectedItems.filter(id => id !== itemId)
      : [...state.selectedItems, itemId],
  };
}

export function toggleAllItems(state: MenuTableState, menuItems: MenuItem[]): MenuTableState {
  const allSelected = menuItems.every(item => state.selectedItems.includes(item.id));
  return {
    ...state,
    selectedItems: allSelected ? [] : menuItems.map(item => item.id),
  };
}

export function toggleActionMenu(state: MenuTableState, itemId: number): MenuTableState {
  return {
    ...state,
    openMenuId: state.openMenuId === itemId ? null : itemId,
  };
}

export function filterMenuItems(items: MenuItem[], filters: MenuFilters): MenuItem[] {
  return items.filter(item => {
    const matchesSearch = !filters.search || 
      item.name.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || 
      item.categories.includes(filters.category);
    
    const matchesStatus = filters.status === null || 
      item.is_available === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
}