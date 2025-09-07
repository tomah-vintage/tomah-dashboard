import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

// A simple in-memory flag and promise to handle concurrent requests.
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const getAuthToken = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('session=')) {
            return cookie.substring('session='.length, cookie.length);
        }
    }
    return null;
};


async function refreshToken(): Promise<void> {
    const response = await fetch('/api/auth/refresh', {
        method: 'POST'
    });

    if (!response.ok) {
        if (browser) {
            const redirectTo = window.location.pathname;
            await goto(`${base}/login?redirectTo=${redirectTo}`);
        }
        throw new Error('Failed to refresh token');
    }
}

async function fetchWithRefresh<T>(url: string, options: RequestInit = {}, type: 'request' | 'file' = 'request'): Promise<T> {
    const getHeaders = (): Headers => {
        const headers = new Headers(options.headers);
        if (type === 'request')
            headers.set('Content-Type', 'application/json');

        const token = getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    };

    const requestOptions: RequestInit = {
        ...options,
        headers: getHeaders(),
    };

    let response = await fetch(url, requestOptions);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken();
            await refreshPromise;
            isRefreshing = false;
            refreshPromise = null;

            response = await fetch(url, { ...requestOptions, headers: getHeaders() });
        } else if (refreshPromise) {
            // Wait for the ongoing refresh to complete
            await refreshPromise;
            // Retry the original request with the new token
            requestOptions.headers = getHeaders();
            response = await fetch(url, requestOptions);
        }
    }

    if (!response.ok) {
        // Handle other errors
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }

    // Handle responses with no content
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
        return Promise.resolve() as Promise<T>;
    }

    return response.json() as Promise<T>;
}

export const apiFetch = fetchWithRefresh;
