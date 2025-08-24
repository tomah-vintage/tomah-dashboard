import { writable } from 'svelte/store';
import type { MenuItemDetail } from '@/lib/types/menu-item-detail';

interface MenuItemDetailStore {
  item: MenuItemDetail | null;
  loading: boolean;
  error: string | null;
}

const initialStore: MenuItemDetailStore = {
  item: null,
  loading: false,
  error: null,
};

export const menuItemDetailStore = writable<MenuItemDetailStore>(initialStore);
