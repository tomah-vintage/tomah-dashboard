import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const initialValue = isBrowser ? localStorage.getItem('theme') === 'dark' : false;

export const themeStore = writable<boolean>(initialValue);

themeStore.subscribe((value) => {
  if (isBrowser) {
    localStorage.setItem('theme', value ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', value);
    console.log('Dark mode is now:', value);
  }
});