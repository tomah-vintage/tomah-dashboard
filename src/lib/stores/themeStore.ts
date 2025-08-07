import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const userPrefersDark = isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialValue = isBrowser ? localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && userPrefersDark) : false;

export const themeStore = writable<boolean>(initialValue);

themeStore.subscribe((value) => {
  if (isBrowser) {
    localStorage.setItem('theme', value ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', value);
    console.log('Dark mode is now:', value);
  }
});