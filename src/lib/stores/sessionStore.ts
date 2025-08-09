import { writable } from 'svelte/store';
import type { User } from '$lib/types/auth';

export const sessionStore = writable<{ user: User | null }>({ user: null });
