# Development Plan - Tomah Dashboard
## Based on Comprehensive Code Review

**Project**: Qpick Dashboard (Tomah Dashboard)  
**Plan Created**: 2025-12-04  
**Exclusions**: E2E Testing, Unit Testing (as requested)  
**Total Estimated Tasks**: 45 items across 4 priority levels

---

## Table of Contents
1. [Priority 1: Critical Security Fixes](#priority-1-critical-security-fixes)
2. [Priority 2: High Priority Improvements](#priority-2-high-priority-improvements)
3. [Priority 3: Code Quality & Architecture](#priority-3-code-quality--architecture)
4. [Priority 4: Performance & Optimization](#priority-4-performance--optimization)
5. [Priority 5: Nice to Have](#priority-5-nice-to-have)
6. [Implementation Timeline](#implementation-timeline)
7. [Risk Assessment](#risk-assessment)

---

## Priority 1: Critical Security Fixes
**Timeline**: Week 1 (5 working days)  
**Risk Level**: 🔴 CRITICAL - Must complete before production deployment

### Task 1.1: Enable HttpOnly Cookies
**Impact**: Prevents XSS-based token theft  
**Files to Modify**:
- `src/routes/api/auth/refresh/+server.ts:36`
- `src/hooks.server.ts` (any cookie.set calls)

**Current Code**:
```typescript
cookies.set('session', newAccessToken, {
    path: '/',
    sameSite: 'strict',
    httpOnly: false,  // ⚠️ CRITICAL
    maxAge: 60 * 60 * 24
});
```

**Required Changes**:
```typescript
cookies.set('session', newAccessToken, {
    path: '/',
    sameSite: 'strict',
    httpOnly: true,      // ✅ FIX
    secure: true,        // ✅ ADD - require HTTPS
    maxAge: 60 * 60 * 24
});
```

**Acceptance Criteria**:
- [x] All authentication cookies have `httpOnly: true`
- [x] All authentication cookies have `secure: true`
- [x] Verify in browser DevTools that cookies are marked as HttpOnly
- [x] Test authentication flow still works

**Estimated Time**: 2 hours

---

### Task 1.2: Refactor Client-Side Token Access
**Impact**: Removes XSS vulnerability surface  
**Files to Modify**:
- `src/lib/utils/api.ts:5-15` (remove `getAuthToken()` function)
- All components using client-side token access

**Current Issue**:
```typescript
const getAuthToken = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    // ⚠️ Reading session token from client-side
};
```

**Solution Approach**:
1. Remove `getAuthToken()` function entirely
2. Refactor `apiFetch()` to work with httpOnly cookies automatically
3. Browser will send cookies automatically with same-origin requests
4. Update fetch calls to use `credentials: 'include'` if needed

**Required Changes**:
```typescript
// api.ts - Updated version
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${PUBLIC_BACKEND_URL}${endpoint}`;
    
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Automatically send httpOnly cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    // Token refresh logic remains the same
    if (response.status === 401) {
        await refreshToken();
        return apiFetch(endpoint, options); // Retry
    }
    
    return response;
}
```

**Acceptance Criteria**:
- [ ] Remove all client-side token reading code
- [ ] Verify API calls still work with httpOnly cookies
- [ ] Test token refresh flow
- [ ] No JavaScript can access session token

**Estimated Time**: 4 hours

---

### Task 1.3: Implement CSRF Protection
**Impact**: Prevents cross-site request forgery attacks  
**Files to Create/Modify**:
- `src/hooks.server.ts` - Generate and validate CSRF tokens
- `src/lib/stores/csrf.ts` - Client-side CSRF token store
- All forms making POST/PUT/DELETE requests

**Implementation Steps**:

1. **Server-side CSRF token generation**:
```typescript
// src/hooks.server.ts
import { randomBytes } from 'crypto';

export const handle: Handle = async ({ event, resolve }) => {
    // Generate CSRF token for each session
    if (!event.cookies.get('csrf_token')) {
        const csrfToken = randomBytes(32).toString('hex');
        event.cookies.set('csrf_token', csrfToken, {
            path: '/',
            httpOnly: false, // Client needs to read this
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        });
    }
    
    // Validate CSRF on state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
        const csrfCookie = event.cookies.get('csrf_token');
        const csrfHeader = event.request.headers.get('x-csrf-token');
        
        if (!csrfCookie || csrfCookie !== csrfHeader) {
            throw error(403, 'CSRF validation failed');
        }
    }
    
    return resolve(event);
};
```

2. **Client-side CSRF token injection**:
```typescript
// src/lib/utils/api.ts
function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${PUBLIC_BACKEND_URL}${endpoint}`;
    const csrfToken = getCsrfToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>)
    };
    
    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET') && csrfToken) {
        headers['x-csrf-token'] = csrfToken;
    }
    
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers
    });
    
    return response;
}
```

**Acceptance Criteria**:
- [ ] CSRF tokens generated for all sessions
- [ ] All POST/PUT/DELETE/PATCH requests include CSRF token
- [ ] Server validates CSRF tokens
- [ ] Requests without valid CSRF token are rejected with 403
- [ ] Test with and without CSRF token

**Estimated Time**: 6 hours

---

### Task 1.4: Add Input Validation & Sanitization
**Impact**: Prevents injection attacks and data corruption  
**Files to Modify**:
- All form components
- `src/lib/schemas/` - Create validation schemas

**Implementation Steps**:

1. **Create Zod validation schemas** (if not already present):
```typescript
// src/lib/schemas/menu-item.schema.ts
import { z } from 'zod';

export const menuItemSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name too long')
        .trim(),
    description: z.string()
        .max(500, 'Description too long')
        .trim()
        .optional(),
    price: z.number()
        .positive('Price must be positive')
        .max(1000000, 'Price too high'),
    category: z.string().uuid('Invalid category'),
    image_url: z.string().url('Invalid URL').optional()
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
```

2. **Apply validation in components**:
```typescript
// Example: menu item form
import { menuItemSchema } from '$lib/schemas/menu-item.schema';

async function handleSubmit() {
    try {
        // Validate before sending
        const validatedData = menuItemSchema.parse(formData);
        
        await apiFetch('/api/menu-items', {
            method: 'POST',
            body: JSON.stringify(validatedData)
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            // Show validation errors
            errors = err.flatten().fieldErrors;
        }
    }
}
```

3. **Create schemas for all domains**:
- [ ] Menu items and categories
- [ ] Restaurant settings
- [ ] Staff management
- [ ] Order processing
- [ ] Banner/marketing content
- [ ] Table management

**Acceptance Criteria**:
- [ ] All user inputs validated with Zod schemas
- [ ] Validation errors shown to users clearly
- [ ] No unvalidated data sent to API
- [ ] Special characters properly escaped
- [ ] URL validation for image uploads

**Estimated Time**: 8 hours

---

### Task 1.5: Implement Environment Variable Validation
**Impact**: Prevents runtime errors from missing configuration  
**Files to Create/Modify**:
- `src/lib/config/env.ts` - New file
- `src/hooks.server.ts` - Import and validate on startup

**Implementation**:
```typescript
// src/lib/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
    PUBLIC_BACKEND_URL: z.string().url('Invalid backend URL'),
    // Add other required env vars
});

export function validateEnv() {
    try {
        envSchema.parse({
            PUBLIC_BACKEND_URL: process.env.PUBLIC_BACKEND_URL,
        });
    } catch (error) {
        console.error('Environment validation failed:', error);
        throw new Error('Invalid environment configuration');
    }
}
```

```typescript
// src/hooks.server.ts
import { validateEnv } from '$lib/config/env';

// Validate on startup
validateEnv();

export const handle: Handle = async ({ event, resolve }) => {
    // ... rest of code
};
```

**Acceptance Criteria**:
- [ ] All required environment variables validated
- [ ] Application fails fast if env vars missing
- [ ] Clear error messages for invalid configuration

**Estimated Time**: 2 hours

---

## Priority 2: High Priority Improvements
**Timeline**: Week 2-3 (10 working days)  
**Risk Level**: 🟡 HIGH - Important for production readiness

### Task 2.1: Implement Structured Logging
**Impact**: Better debugging, monitoring, and error tracking  
**Files to Create/Modify**:
- `src/lib/utils/logger.ts` - New file
- All files with console.log/error (80+ instances)

**Implementation**:
```typescript
// src/lib/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    
    private log(level: LogLevel, message: string, context?: LogContext) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...context
        };
        
        if (this.isDevelopment) {
            console[level === 'debug' ? 'log' : level](
                `[${level.toUpperCase()}] ${message}`,
                context
            );
        } else {
            // In production, send to logging service
            // TODO: Integrate with Sentry/LogRocket/etc
            console.log(JSON.stringify(logEntry));
        }
    }
    
    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            this.log('debug', message, context);
        }
    }
    
    info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }
    
    warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }
    
    error(message: string, error?: Error, context?: LogContext) {
        this.log('error', message, {
            ...context,
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : undefined
        });
    }
}

export const logger = new Logger();
```

**Migration Strategy**:
```typescript
// Before:
console.error("Failed to fetch user:", error);

// After:
logger.error("Failed to fetch user", error, { userId, attemptCount });
```

**Acceptance Criteria**:
- [ ] Logger utility created
- [ ] All console.log replaced with logger.debug
- [ ] All console.error replaced with logger.error
- [ ] All console.warn replaced with logger.warn
- [ ] Production logs in JSON format
- [ ] Development logs human-readable

**Estimated Time**: 12 hours

---

### Task 2.2: Standardize Error Handling
**Impact**: Consistent error experience, better debugging  
**Files to Create/Modify**:
- `src/lib/utils/error-handler.ts` - New file
- `src/lib/types/errors.ts` - New file
- All API call sites

**Implementation**:
```typescript
// src/lib/types/errors.ts
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ValidationError extends Error {
    constructor(message: string, public fields: Record<string, string[]>) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
```

```typescript
// src/lib/utils/error-handler.ts
import { logger } from './logger';
import { ApiError, ValidationError, AuthenticationError } from '$lib/types/errors';
import { toast } from 'svelte-french-toast';

export function handleError(error: unknown, context?: string) {
    logger.error('Error occurred', error as Error, { context });
    
    if (error instanceof ValidationError) {
        toast.error('Please check your input');
        return error.fields;
    }
    
    if (error instanceof AuthenticationError) {
        toast.error('Please log in again');
        // Redirect to login
        return;
    }
    
    if (error instanceof ApiError) {
        toast.error(error.message || 'An error occurred');
        return;
    }
    
    // Unknown error
    toast.error('An unexpected error occurred');
}
```

**Usage Pattern**:
```typescript
async function saveMenuItem() {
    try {
        const response = await apiFetch('/api/menu-items', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new ApiError(
                'Failed to save menu item',
                response.status
            );
        }
        
        toast.success('Menu item saved');
    } catch (error) {
        handleError(error, 'saveMenuItem');
    }
}
```

**Acceptance Criteria**:
- [ ] Custom error classes created
- [ ] Centralized error handler
- [ ] Consistent error messages to users
- [ ] All errors logged properly
- [ ] Sensitive data not exposed in errors

**Estimated Time**: 8 hours

---

### Task 2.3: Add API Request Timeouts & Retry Logic
**Impact**: Better resilience to network issues  
**Files to Modify**:
- `src/lib/utils/api.ts`
- `src/lib/utils/api-call-for-server.ts`

**Implementation**:
```typescript
// src/lib/utils/api.ts

interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

async function fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { timeout = 30000, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function fetchWithRetry(
    url: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
    
    for (let i = 0; i <= retries; i++) {
        try {
            return await fetchWithTimeout(url, fetchOptions);
        } catch (error) {
            const isLastAttempt = i === retries;
            const isAbortError = error instanceof Error && error.name === 'AbortError';
            
            if (isLastAttempt || isAbortError) {
                throw error;
            }
            
            // Exponential backoff
            const delay = retryDelay * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            logger.warn('Retrying request', { url, attempt: i + 1, maxRetries: retries });
        }
    }
    
    throw new Error('Max retries exceeded');
}

export async function apiFetch(
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> {
    const url = `${PUBLIC_BACKEND_URL}${endpoint}`;
    
    // Use retry for GET requests, timeout for mutations
    const fetchFn = options.method === 'GET' ? fetchWithRetry : fetchWithTimeout;
    
    try {
        const response = await fetchFn(url, {
            ...options,
            timeout: 30000,
            retries: options.method === 'GET' ? 3 : 0,
            credentials: 'include'
        });
        
        if (response.status === 401) {
            await refreshToken();
            return apiFetch(endpoint, options);
        }
        
        return response;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408);
        }
        throw error;
    }
}
```

**Acceptance Criteria**:
- [ ] All API requests have timeouts (30s default)
- [ ] GET requests retry on failure (3 attempts)
- [ ] Exponential backoff between retries
- [ ] Mutations don't auto-retry
- [ ] Timeout errors handled gracefully

**Estimated Time**: 6 hours

---

### Task 2.4: Implement Request Cancellation
**Impact**: Better UX, prevents race conditions  
**Files to Modify**:
- `src/lib/queries/*.ts` - Update query functions
- Components with long-running requests

**Implementation**:
```typescript
// Example: Cancellable search
let abortController: AbortController | null = null;

async function searchMenuItems(query: string) {
    // Cancel previous request
    if (abortController) {
        abortController.abort();
    }
    
    abortController = new AbortController();
    
    try {
        const response = await apiFetch(`/api/menu-items?search=${query}`, {
            signal: abortController.signal
        });
        
        return response.json();
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            // Request was cancelled, ignore
            return;
        }
        throw error;
    }
}
```

**Key Use Cases**:
- Search/autocomplete fields
- Infinite scroll pagination
- Navigation away from pages with pending requests

**Acceptance Criteria**:
- [ ] Search requests cancellable
- [ ] Navigation cancels pending requests
- [ ] No race conditions in data updates

**Estimated Time**: 4 hours

---

### Task 2.5: Create Global Error Boundaries
**Impact**: Graceful error recovery, better UX  
**Files to Create**:
- `src/routes/+error.svelte` - Root error boundary
- `src/routes/(rsadmin)/+error.svelte` - Restaurant admin error boundary
- `src/routes/(pladmin)/+error.svelte` - Platform admin error boundary

**Implementation**:
```svelte
<!-- src/routes/+error.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { logger } from '$lib/utils/logger';
    
    $: {
        logger.error('Application error', $page.error, {
            route: $page.route.id,
            params: $page.params
        });
    }
</script>

<div class="error-container">
    <div class="error-card">
        <h1>Something went wrong</h1>
        
        {#if $page.status === 404}
            <p>Page not found</p>
        {:else if $page.status === 403}
            <p>You don't have permission to access this page</p>
        {:else if $page.status === 500}
            <p>Internal server error</p>
        {:else}
            <p>An unexpected error occurred</p>
        {/if}
        
        <div class="error-actions">
            <a href="/" class="btn btn-primary">Go Home</a>
            <button onclick={() => location.reload()} class="btn btn-secondary">
                Retry
            </button>
        </div>
        
        {#if import.meta.env.DEV}
            <details class="error-details">
                <summary>Error Details (Dev Only)</summary>
                <pre>{JSON.stringify($page.error, null, 2)}</pre>
            </details>
        {/if}
    </div>
</div>

<style>
    .error-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .error-card {
        max-width: 500px;
        text-align: center;
    }
    
    .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .error-details {
        margin-top: 2rem;
        text-align: left;
    }
</style>
```

**Acceptance Criteria**:
- [ ] Error boundaries for all route groups
- [ ] User-friendly error messages
- [ ] Retry functionality
- [ ] Error details in development only
- [ ] Errors logged to monitoring service

**Estimated Time**: 4 hours

---

### Task 2.6: Add Role-Based Access Control (RBAC)
**Impact**: Proper authorization, security hardening  
**Files to Create/Modify**:
- `src/lib/utils/permissions.ts` - New file
- `src/hooks.server.ts` - Add permission checks
- All route +page.server.ts files

**Implementation**:
```typescript
// src/lib/utils/permissions.ts
export enum Role {
    PLATFORM_ADMIN = 'PLATFORM_ADMIN',
    RESTAURANT_ADMIN = 'RESTAURANT_ADMIN',
    STAFF = 'STAFF'
}

export enum Permission {
    // Platform admin
    MANAGE_RESTAURANTS = 'manage:restaurants',
    VIEW_ALL_ANALYTICS = 'view:all_analytics',
    
    // Restaurant admin
    MANAGE_MENU = 'manage:menu',
    MANAGE_ORDERS = 'manage:orders',
    MANAGE_STAFF = 'manage:staff',
    VIEW_RESTAURANT_ANALYTICS = 'view:restaurant_analytics',
    
    // Staff
    VIEW_ORDERS = 'view:orders',
    UPDATE_ORDER_STATUS = 'update:order_status'
}

const rolePermissions: Record<Role, Permission[]> = {
    [Role.PLATFORM_ADMIN]: [
        Permission.MANAGE_RESTAURANTS,
        Permission.VIEW_ALL_ANALYTICS,
        // Platform admins have all permissions
        ...Object.values(Permission)
    ],
    [Role.RESTAURANT_ADMIN]: [
        Permission.MANAGE_MENU,
        Permission.MANAGE_ORDERS,
        Permission.MANAGE_STAFF,
        Permission.VIEW_RESTAURANT_ANALYTICS,
        Permission.VIEW_ORDERS,
        Permission.UPDATE_ORDER_STATUS
    ],
    [Role.STAFF]: [
        Permission.VIEW_ORDERS,
        Permission.UPDATE_ORDER_STATUS
    ]
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
    return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function requirePermission(userRole: Role, permission: Permission) {
    if (!hasPermission(userRole, permission)) {
        throw error(403, 'Insufficient permissions');
    }
}
```

```typescript
// src/hooks.server.ts
import { requirePermission, Role, Permission } from '$lib/utils/permissions';

export const handle: Handle = async ({ event, resolve }) => {
    // ... existing auth code ...
    
    // Check route-level permissions
    if (event.route.id?.includes("(pladmin)")) {
        if (event.locals.user?.role !== Role.PLATFORM_ADMIN) {
            throw error(403, 'Platform admin access required');
        }
    }
    
    if (event.route.id?.includes("(rsadmin)")) {
        if (!event.locals.user || 
            ![Role.PLATFORM_ADMIN, Role.RESTAURANT_ADMIN].includes(event.locals.user.role)) {
            throw error(403, 'Restaurant admin access required');
        }
    }
    
    return resolve(event);
};
```

**Usage in Routes**:
```typescript
// src/routes/(rsadmin)/staff/+page.server.ts
import { requirePermission, Permission } from '$lib/utils/permissions';

export const load: PageServerLoad = async ({ locals }) => {
    requirePermission(locals.user.role, Permission.MANAGE_STAFF);
    
    // ... load staff data ...
};
```

**Acceptance Criteria**:
- [ ] Permission system defined
- [ ] Role-to-permission mapping created
- [ ] Server-side permission checks on all routes
- [ ] 403 errors for unauthorized access
- [ ] Test all role combinations

**Estimated Time**: 10 hours

---

### Task 2.7: Implement Rate Limiting
**Impact**: Prevents abuse, DDoS protection  
**Files to Create/Modify**:
- `src/lib/middleware/rate-limiter.ts` - New file
- `src/hooks.server.ts` - Apply rate limiting

**Implementation**:
```typescript
// src/lib/middleware/rate-limiter.ts
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

class RateLimiter {
    private requests: Map<string, number[]> = new Map();
    
    constructor(private config: RateLimitConfig) {}
    
    check(identifier: string): boolean {
        const now = Date.now();
        const windowStart = now - this.config.windowMs;
        
        // Get existing requests for this identifier
        let userRequests = this.requests.get(identifier) || [];
        
        // Remove old requests outside the window
        userRequests = userRequests.filter(time => time > windowStart);
        
        // Check if limit exceeded
        if (userRequests.length >= this.config.maxRequests) {
            return false;
        }
        
        // Add current request
        userRequests.push(now);
        this.requests.set(identifier, userRequests);
        
        return true;
    }
    
    cleanup() {
        const now = Date.now();
        for (const [identifier, requests] of this.requests.entries()) {
            const validRequests = requests.filter(
                time => time > now - this.config.windowMs
            );
            if (validRequests.length === 0) {
                this.requests.delete(identifier);
            } else {
                this.requests.set(identifier, validRequests);
            }
        }
    }
}

// Different limits for different endpoints
export const loginRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
});

export const apiRateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
});

// Cleanup old entries every 5 minutes
setInterval(() => {
    loginRateLimiter.cleanup();
    apiRateLimiter.cleanup();
}, 5 * 60 * 1000);
```

```typescript
// src/hooks.server.ts
import { loginRateLimiter, apiRateLimiter } from '$lib/middleware/rate-limiter';

export const handle: Handle = async ({ event, resolve }) => {
    const clientIp = event.getClientAddress();
    
    // Apply rate limiting
    if (event.route.id?.includes('/api/auth/login')) {
        if (!loginRateLimiter.check(clientIp)) {
            throw error(429, 'Too many login attempts. Please try again later.');
        }
    }
    
    if (event.route.id?.startsWith('/api/')) {
        if (!apiRateLimiter.check(clientIp)) {
            throw error(429, 'Too many requests. Please slow down.');
        }
    }
    
    return resolve(event);
};
```

**Acceptance Criteria**:
- [ ] Rate limiting on login endpoint (5 attempts per 15 min)
- [ ] Rate limiting on API endpoints (100 requests per minute)
- [ ] 429 status code returned when limit exceeded
- [ ] Clear error message to users
- [ ] Periodic cleanup of old entries

**Estimated Time**: 6 hours

---

### Task 2.8: Add Session Management UI
**Impact**: Better security UX, user control  
**Files to Create**:
- `src/routes/(rsadmin)/account/sessions/+page.svelte` - New page
- `src/routes/api/sessions/+server.ts` - Session management API

**Features**:
- List all active sessions
- Show last activity time
- Show device/browser info
- Allow users to revoke sessions
- Highlight current session

**Implementation Sketch**:
```svelte
<!-- src/routes/(rsadmin)/account/sessions/+page.svelte -->
<script lang="ts">
    import { apiFetch } from '$lib/utils/api';
    import { toast } from 'svelte-french-toast';
    
    interface Session {
        id: string;
        device: string;
        browser: string;
        ip: string;
        lastActivity: string;
        isCurrent: boolean;
    }
    
    let sessions: Session[] = [];
    
    async function loadSessions() {
        const response = await apiFetch('/api/sessions');
        sessions = await response.json();
    }
    
    async function revokeSession(sessionId: string) {
        if (!confirm('Revoke this session?')) return;
        
        await apiFetch(`/api/sessions/${sessionId}`, {
            method: 'DELETE'
        });
        
        toast.success('Session revoked');
        loadSessions();
    }
    
    $: loadSessions();
</script>

<div class="sessions-page">
    <h1>Active Sessions</h1>
    
    <div class="sessions-list">
        {#each sessions as session}
            <div class="session-card" class:current={session.isCurrent}>
                <div class="session-info">
                    <h3>{session.device}</h3>
                    <p>{session.browser}</p>
                    <p class="text-sm text-gray-500">
                        Last active: {new Date(session.lastActivity).toLocaleString()}
                    </p>
                    <p class="text-sm text-gray-500">IP: {session.ip}</p>
                </div>
                
                {#if session.isCurrent}
                    <span class="badge-current">Current Session</span>
                {:else}
                    <button 
                        onclick={() => revokeSession(session.id)}
                        class="btn-revoke"
                    >
                        Revoke
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</div>
```

**Note**: This requires backend support for session tracking, which may need to be added to the external API.

**Acceptance Criteria**:
- [ ] List all active sessions
- [ ] Show session details (device, browser, IP, last activity)
- [ ] Allow revoking non-current sessions
- [ ] Highlight current session
- [ ] Confirm before revoking

**Estimated Time**: 8 hours (frontend only; backend may need separate work)

---

## Priority 3: Code Quality & Architecture
**Timeline**: Week 4-6 (15 working days)  
**Risk Level**: 🟢 MEDIUM - Important for maintainability

### Task 3.1: Refactor Large Files (>300 lines)
**Impact**: Better maintainability, easier testing  
**Target Files**: 13 files identified

#### Subtask 3.1.1: Delete Backup File
**File**: `src/lib/components/restaurant-settings/RestaurantSettingsFormModern.backup.svelte` (491 lines)

**Action**: Delete this file immediately - use git history for recovery if needed.

**Estimated Time**: 5 minutes

---

#### Subtask 3.1.2: Refactor restaurant-queries.ts (585 lines)
**File**: `src/lib/queries/restaurant-queries.ts`

**Current Issues**:
- Too many queries in one file
- Mixed concerns (CRUD operations, listings, etc.)
- Hard to find specific queries

**Refactoring Plan**:
1. Split into multiple files:
   - `restaurant-list-queries.ts` - Listing and filtering
   - `restaurant-create-queries.ts` - Creation mutations
   - `restaurant-update-queries.ts` - Update mutations
   - `restaurant-delete-queries.ts` - Delete operations
   - `restaurant-detail-queries.ts` - Single restaurant queries

2. Create index file for re-exports:
```typescript
// src/lib/queries/restaurants/index.ts
export * from './restaurant-list-queries';
export * from './restaurant-create-queries';
export * from './restaurant-update-queries';
export * from './restaurant-delete-queries';
export * from './restaurant-detail-queries';
```

3. Update imports in components

**Acceptance Criteria**:
- [ ] File split into 5 separate files
- [ ] Each file <150 lines
- [ ] All imports updated
- [ ] No functionality broken

**Estimated Time**: 6 hours

---

#### Subtask 3.1.3: Refactor OrderReportTable.svelte (413 lines)
**File**: `src/lib/components/report/OrderReportTable.svelte`

**Refactoring Plan**:
1. Extract components:
   - `OrderReportFilters.svelte` - Date range, status filters
   - `OrderReportTableHeader.svelte` - Table headers with sorting
   - `OrderReportTableRow.svelte` - Single order row
   - `OrderReportPagination.svelte` - Pagination controls
   - `OrderReportSummary.svelte` - Summary stats

2. Keep main component as composition:
```svelte
<!-- OrderReportTable.svelte - ~80 lines -->
<script lang="ts">
    import OrderReportFilters from './OrderReportFilters.svelte';
    import OrderReportTableHeader from './OrderReportTableHeader.svelte';
    import OrderReportTableRow from './OrderReportTableRow.svelte';
    import OrderReportPagination from './OrderReportPagination.svelte';
    import OrderReportSummary from './OrderReportSummary.svelte';
    
    // State and logic
</script>

<div class="order-report">
    <OrderReportFilters bind:filters />
    <OrderReportSummary data={summaryData} />
    
    <table>
        <OrderReportTableHeader 
            {sortBy} 
            {sortOrder} 
            on:sort={handleSort} 
        />
        <tbody>
            {#each orders as order}
                <OrderReportTableRow {order} />
            {/each}
        </tbody>
    </table>
    
    <OrderReportPagination 
        {page} 
        {totalPages} 
        on:change={handlePageChange} 
    />
</div>
```

**Acceptance Criteria**:
- [ ] 5 new components extracted
- [ ] Main component <100 lines
- [ ] Components reusable
- [ ] Proper prop passing
- [ ] No functionality broken

**Estimated Time**: 8 hours

---

#### Subtask 3.1.4: Refactor Other Large Files
**Files**:
- `src/routes/(rsadmin)/subscription/+page.svelte` (397 lines)
- `src/lib/components/banners/BannerGrid.svelte` (370 lines)
- `src/lib/types/restaurant.ts` (347 lines)
- `src/routes/+page.svelte` (340 lines)
- `src/routes/(rsadmin)/seating/+page.svelte` (335 lines)
- `src/routes/(rsadmin)/staff/+page.svelte` (322 lines)
- `src/lib/queries/menu-queries.ts` (311 lines)

**Strategy**:
- Apply similar refactoring patterns
- Extract reusable components
- Split type files by domain
- Break query files by operation type

**Estimated Time**: 24 hours (3 hours per file average)

**Total for Task 3.1**: 38 hours

---

### Task 3.2: Standardize Data Fetching Patterns
**Impact**: Consistent patterns, easier onboarding  
**Files to Modify**: Multiple routes and components

**Current Issue**:
- Some routes use `+page.server.ts` (SSR)
- Others use TanStack Query (CSR)
- No clear guideline when to use which

**Decision Framework**:

**Use Server Load Functions (+page.server.ts) when**:
- Initial page data needed for SEO
- Data should be rendered server-side
- Authentication required before any JS loads
- Example: Restaurant listings, public menu pages

**Use TanStack Query when**:
- Interactive data (frequent updates)
- User-specific data post-authentication
- Real-time features
- Example: Order management, dashboard stats

**Implementation**:
1. Document decision framework in `ARCHITECTURE.md`
2. Audit current usage
3. Refactor inconsistent patterns
4. Add comments explaining choice

**Acceptance Criteria**:
- [ ] Documentation created
- [ ] Audit completed
- [ ] Inconsistencies refactored
- [ ] Team aligned on patterns

**Estimated Time**: 12 hours

---

### Task 3.3: Extract Magic Numbers to Constants
**Impact**: Better code readability  
**Files to Modify**: Multiple files with hardcoded values

**Current Issues**:
```typescript
maxAge: 60 * 60 * 24 // What does this mean?
ttl: 300000 // 5 minutes?
setTimeout(() => {}, 3000) // Random delay?
```

**Solution**:
```typescript
// src/lib/constants/time.ts
export const TIME = {
    ONE_SECOND_MS: 1000,
    ONE_MINUTE_MS: 60 * 1000,
    FIVE_MINUTES_MS: 5 * 60 * 1000,
    ONE_HOUR_MS: 60 * 60 * 1000,
    ONE_DAY_MS: 24 * 60 * 60 * 1000,
    ONE_WEEK_MS: 7 * 24 * 60 * 60 * 1000,
    
    ONE_MINUTE_SECONDS: 60,
    ONE_HOUR_SECONDS: 60 * 60,
    ONE_DAY_SECONDS: 24 * 60 * 60
} as const;

// src/lib/constants/cache.ts
export const CACHE_TTL = {
    SHORT: TIME.FIVE_MINUTES_MS,
    MEDIUM: TIME.ONE_HOUR_MS,
    LONG: TIME.ONE_DAY_MS
} as const;

// src/lib/constants/api.ts
export const API_CONFIG = {
    TIMEOUT_MS: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000
} as const;
```

**Usage**:
```typescript
// Before:
cookies.set('session', token, { maxAge: 60 * 60 * 24 });

// After:
import { TIME } from '$lib/constants/time';
cookies.set('session', token, { maxAge: TIME.ONE_DAY_SECONDS });
```

**Acceptance Criteria**:
- [ ] Constants files created
- [ ] All magic numbers replaced
- [ ] Meaningful names used
- [ ] Types preserved

**Estimated Time**: 6 hours

---

### Task 3.4: Improve Component Organization
**Impact**: Easier to find components, better structure  
**Current Structure**:
```
src/lib/components/
├── banners/
├── menu/
├── restaurant-settings/
└── ... (mixed organization)
```

**Proposed Structure**:
```
src/lib/components/
├── ui/              # Generic UI components
│   ├── Button.svelte
│   ├── Modal.svelte
│   ├── Input.svelte
│   └── ...
├── layout/          # Layout components
│   ├── Navbar.svelte
│   ├── Sidebar.svelte
│   └── ...
├── domain/          # Domain-specific components
│   ├── menu/
│   ├── orders/
│   ├── restaurants/
│   ├── staff/
│   └── ...
└── shared/          # Shared business components
    ├── ImageUpload.svelte
    ├── DatePicker.svelte
    └── ...
```

**Implementation Steps**:
1. Create new folder structure
2. Move components to appropriate locations
3. Update all imports
4. Create barrel exports (index.ts)
5. Update documentation

**Acceptance Criteria**:
- [ ] New structure created
- [ ] All components moved
- [ ] Imports updated
- [ ] No broken references
- [ ] Documentation updated

**Estimated Time**: 8 hours

---

### Task 3.5: Add JSDoc Comments to Public APIs
**Impact**: Better developer experience  
**Target**: All public functions, types, and components

**Example**:
```typescript
/**
 * Fetches data from the API with automatic token refresh
 * @param endpoint - API endpoint (e.g., '/api/menu-items')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise resolving to Response object
 * @throws {ApiError} When the request fails
 * @throws {AuthenticationError} When authentication fails after retry
 * 
 * @example
 * ```typescript
 * const response = await apiFetch('/api/menu-items', {
 *   method: 'POST',
 *   body: JSON.stringify(menuItem)
 * });
 * ```
 */
export async function apiFetch(
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> {
    // ...
}
```

**Acceptance Criteria**:
- [ ] All exported functions documented
- [ ] Complex functions have examples
- [ ] Parameters and return types described
- [ ] Exceptions documented

**Estimated Time**: 10 hours

---

## Priority 4: Performance & Optimization
**Timeline**: Week 7-8 (10 working days)  
**Risk Level**: 🟢 MEDIUM - Good to have

### Task 4.1: Bundle Size Analysis & Optimization
**Impact**: Faster page loads  

**Steps**:
1. **Add bundle analyzer**:
```bash
bun add -D vite-plugin-bundle-analyzer
```

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { analyzer } from 'vite-plugin-bundle-analyzer';

export default {
    plugins: [
        sveltekit(),
        analyzer({
            analyzerMode: 'static',
            openAnalyzer: false
        })
    ]
};
```

2. **Identify large dependencies**
3. **Lazy load heavy components**:
```typescript
// Before: Immediate import
import MapView from '$lib/components/MapView.svelte';

// After: Lazy load
let MapView;
$: if (showMap) {
    import('$lib/components/MapView.svelte').then(m => {
        MapView = m.default;
    });
}
```

4. **Split vendor chunks**
5. **Remove unused dependencies**

**Acceptance Criteria**:
- [ ] Bundle size report generated
- [ ] Large dependencies identified
- [ ] Lazy loading implemented for maps, charts
- [ ] Total bundle size <500KB (gzipped)

**Estimated Time**: 8 hours

---

### Task 4.2: Image Optimization
**Impact**: Faster loads, lower bandwidth  

**Implementation**:
1. **Client-side image compression before upload**:
```typescript
// src/lib/utils/image-upload.ts
import imageCompression from 'browser-image-compression';

export async function uploadImage(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new ValidationError('Only image files allowed', {});
    }
    
    // Compress image
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    
    const compressedFile = await imageCompression(file, options);
    
    const formData = new FormData();
    formData.append('file', compressedFile);
    
    const response = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}
```

2. **Add image lazy loading**:
```svelte
<img 
    src={imageUrl} 
    alt={alt}
    loading="lazy"
    decoding="async"
/>
```

3. **Use responsive images**:
```svelte
<picture>
    <source 
        srcset="{imageUrl}?w=400 400w, {imageUrl}?w=800 800w" 
        sizes="(max-width: 768px) 400px, 800px"
    />
    <img src={imageUrl} alt={alt} loading="lazy" />
</picture>
```

**Acceptance Criteria**:
- [ ] Images compressed before upload
- [ ] File size validation (max 5MB)
- [ ] Lazy loading on all images
- [ ] Responsive image sizes

**Estimated Time**: 6 hours

---

### Task 4.3: Optimize Cache Strategy
**Impact**: Better cache hit rates  

**Current Issues**:
- Cleanup interval every 1 minute may be too aggressive
- No LRU eviction
- No cache size limits

**Improvements**:
```typescript
// src/lib/cache/memory-cache.ts
interface CacheConfig {
    maxSize: number;        // Max entries
    maxMemoryMB: number;    // Max memory usage
    cleanupIntervalMs: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry> = new Map();
    private accessOrder: string[] = []; // For LRU
    
    constructor(private config: CacheConfig) {
        // Less frequent cleanup
        this.cleanupInterval = setInterval(
            () => this.cleanup(), 
            config.cleanupIntervalMs
        );
    }
    
    get(key: string): any {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        // Update LRU
        this.touchKey(key);
        
        // Check expiration
        if (Date.now() > entry.expiresAt) {
            this.delete(key);
            return null;
        }
        
        return entry.value;
    }
    
    set(key: string, value: any, ttl: number) {
        // Evict if at capacity
        if (this.cache.size >= this.config.maxSize) {
            this.evictLRU();
        }
        
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttl
        });
        
        this.touchKey(key);
    }
    
    private evictLRU() {
        const lruKey = this.accessOrder[0];
        if (lruKey) {
            this.delete(lruKey);
        }
    }
    
    private touchKey(key: string) {
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
        }
        this.accessOrder.push(key);
    }
}
```

**Acceptance Criteria**:
- [ ] LRU eviction implemented
- [ ] Cache size limits enforced
- [ ] Less frequent cleanup (5 minutes)
- [ ] Memory usage monitoring

**Estimated Time**: 6 hours

---

### Task 4.4: Add Performance Monitoring
**Impact**: Identify bottlenecks  

**Implementation**:
```typescript
// src/lib/utils/performance.ts
export function measurePerformance(name: string) {
    const start = performance.now();
    
    return () => {
        const duration = performance.now() - start;
        logger.info('Performance measurement', {
            name,
            duration: `${duration.toFixed(2)}ms`
        });
        
        // Report to analytics service
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'timing_complete', {
                name,
                value: Math.round(duration),
                event_category: 'Performance'
            });
        }
    };
}

// Usage:
async function loadMenuItems() {
    const end = measurePerformance('loadMenuItems');
    
    try {
        const items = await apiFetch('/api/menu-items');
        return items.json();
    } finally {
        end();
    }
}
```

**Key Metrics to Track**:
- API response times
- Page load times
- Component render times
- Cache hit/miss rates

**Acceptance Criteria**:
- [ ] Performance measurement utility
- [ ] Track API response times
- [ ] Track page load times
- [ ] Dashboard for viewing metrics (optional)

**Estimated Time**: 6 hours

---

### Task 4.5: Implement Virtual Scrolling
**Impact**: Better performance for long lists  
**Target**: Order lists, menu item lists with >100 items

**Implementation**:
```bash
bun add svelte-virtual-scroll-list
```

```svelte
<script lang="ts">
    import VirtualList from 'svelte-virtual-scroll-list';
    
    let orders: Order[] = []; // Could be 1000+ items
</script>

<VirtualList 
    data={orders}
    key="id"
    let:data
    itemHeight={80}
    height={600}
>
    <OrderCard order={data} />
</VirtualList>
```

**Acceptance Criteria**:
- [ ] Virtual scrolling on order lists
- [ ] Virtual scrolling on menu item lists
- [ ] Smooth scrolling experience
- [ ] Proper height calculations

**Estimated Time**: 4 hours

---

## Priority 5: Nice to Have
**Timeline**: Week 9+ (Ongoing)  
**Risk Level**: ⚪ LOW - Optional improvements

### Task 5.1: Internationalization (i18n) Setup
**Impact**: Multi-language support readiness  

**Implementation**:
```bash
bun add svelte-i18n
```

```typescript
// src/lib/i18n/index.ts
import { init, register, locale } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('mn', () => import('./locales/mn.json'));

init({
    fallbackLocale: 'en',
    initialLocale: 'en'
});
```

**Estimated Time**: 12 hours

---

### Task 5.2: Add Health Check Endpoint
**Impact**: Better monitoring  

```typescript
// src/routes/api/health/+server.ts
export async function GET() {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version
    };
    
    return json(health);
}
```

**Estimated Time**: 2 hours

---

### Task 5.3: Set Up Error Monitoring (Sentry)
**Impact**: Better error tracking  

```bash
bun add @sentry/sveltekit
```

```typescript
// src/hooks.client.ts
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});
```

**Estimated Time**: 4 hours

---

### Task 5.4: Add CI/CD Pipeline
**Impact**: Automated deployments  

**GitHub Actions Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Lint
        run: bun run lint
      
      - name: Type check
        run: bun run check
      
      - name: Build
        run: bun run build
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: bunx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Estimated Time**: 6 hours

---

### Task 5.5: Add Documentation
**Impact**: Better onboarding  

**Files to Create**:
- `ARCHITECTURE.md` - System architecture
- `CONTRIBUTING.md` - Contribution guidelines
- `API.md` - API documentation
- `DEPLOYMENT.md` - Deployment instructions

**Estimated Time**: 12 hours

---

### Task 5.6: Code Splitting Optimization
**Impact**: Smaller initial bundles  

**Implementation**:
```typescript
// vite.config.ts
export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-svelte': ['svelte', '@sveltejs/kit'],
                    'vendor-ui': ['skeleton-svelte', 'lucide-svelte'],
                    'vendor-query': ['@tanstack/svelte-query'],
                    'vendor-map': ['leaflet']
                }
            }
        }
    }
};
```

**Estimated Time**: 4 hours

---

## Implementation Timeline

### Sprint 1 (Week 1): Critical Security
**Duration**: 5 days  
**Focus**: Security vulnerabilities

- Day 1: Task 1.1 - Enable HttpOnly cookies
- Day 2: Task 1.2 - Refactor client-side token access
- Day 3: Task 1.3 - Implement CSRF protection
- Day 4-5: Task 1.4 - Input validation & sanitization

**Deliverables**:
- [ ] All critical security issues resolved
- [ ] Security testing completed
- [ ] Documentation updated

---

### Sprint 2 (Week 2-3): High Priority
**Duration**: 10 days  
**Focus**: Production readiness

**Week 2**:
- Day 1-2: Task 2.1 - Structured logging
- Day 3-4: Task 2.2 - Standardize error handling
- Day 5: Task 2.3 - API timeouts & retry

**Week 3**:
- Day 1: Task 2.4 - Request cancellation
- Day 2: Task 2.5 - Error boundaries
- Day 3-4: Task 2.6 - RBAC implementation
- Day 5: Task 2.7 - Rate limiting

**Deliverables**:
- [ ] Production-grade error handling
- [ ] Proper logging system
- [ ] Authorization system
- [ ] Rate limiting active

---

### Sprint 3-4 (Week 4-6): Code Quality
**Duration**: 15 days  
**Focus**: Refactoring and architecture

**Week 4**:
- Day 1-5: Task 3.1 - Refactor large files (start with top 5)

**Week 5**:
- Day 1-2: Task 3.1 - Continue refactoring
- Day 3-4: Task 3.2 - Standardize data fetching
- Day 5: Task 3.3 - Extract magic numbers

**Week 6**:
- Day 1-2: Task 3.4 - Component reorganization
- Day 3-5: Task 3.5 - JSDoc documentation

**Deliverables**:
- [ ] All files <300 lines
- [ ] Consistent patterns
- [ ] Well-documented code
- [ ] Better structure

---

### Sprint 5-6 (Week 7-8): Performance
**Duration**: 10 days  
**Focus**: Optimization

**Week 7**:
- Day 1-2: Task 4.1 - Bundle analysis & optimization
- Day 3: Task 4.2 - Image optimization
- Day 4: Task 4.3 - Cache optimization
- Day 5: Task 4.4 - Performance monitoring

**Week 8**:
- Day 1: Task 4.5 - Virtual scrolling
- Day 2-5: Buffer for optimization tweaks

**Deliverables**:
- [ ] Optimized bundle sizes
- [ ] Better cache performance
- [ ] Performance monitoring active
- [ ] Virtual scrolling implemented

---

### Ongoing (Week 9+): Nice to Have
**Duration**: As time permits  
**Focus**: Additional improvements

- Task 5.1 - i18n setup (when needed)
- Task 5.2 - Health checks (easy win)
- Task 5.3 - Error monitoring (recommended)
- Task 5.4 - CI/CD pipeline (recommended)
- Task 5.5 - Documentation (ongoing)
- Task 5.6 - Further optimization

---

## Risk Assessment

### High Risk Items 🔴
**Task 1.2**: Refactoring client-side token access
- **Risk**: Could break authentication flow
- **Mitigation**: 
  - Test thoroughly in development
  - Deploy to staging first
  - Have rollback plan ready
  - Monitor error rates closely

**Task 2.6**: RBAC implementation
- **Risk**: Could lock out users or expose unauthorized data
- **Mitigation**:
  - Test all role combinations
  - Verify permissions on both client and server
  - Have override mechanism for admins
  - Document permission matrix

---

### Medium Risk Items 🟡
**Task 3.1**: Large file refactoring
- **Risk**: Could introduce bugs during refactoring
- **Mitigation**:
  - Refactor one file at a time
  - Verify functionality after each refactor
  - Use git branches
  - Code review each refactor

**Task 4.1**: Bundle optimization
- **Risk**: Could break code splitting or lazy loading
- **Mitigation**:
  - Test all routes after changes
  - Monitor bundle sizes
  - Verify all dynamic imports work

---

### Low Risk Items 🟢
Most Priority 4 and 5 tasks are low risk:
- Logging improvements
- Documentation
- Performance monitoring
- Nice-to-have features

---

## Success Metrics

### Security Metrics
- [ ] All critical security issues resolved (httpOnly, CSRF, etc.)
- [ ] 0 XSS vulnerabilities
- [ ] 0 authentication bypass vulnerabilities
- [ ] Rate limiting active and effective

### Code Quality Metrics
- [ ] 100% of files <300 lines
- [ ] 90%+ of files <200 lines
- [ ] 0 console.log in production
- [ ] Consistent error handling patterns
- [ ] All public APIs documented

### Performance Metrics
- [ ] Bundle size <500KB (gzipped)
- [ ] Page load time <2 seconds
- [ ] API response time <500ms (p95)
- [ ] Cache hit rate >70%

### Developer Experience
- [ ] Clear architecture documentation
- [ ] Consistent patterns throughout
- [ ] Easy to onboard new developers
- [ ] Fast feedback loops (lint, type check)

---

## Notes

### Dependencies
- Some tasks depend on backend API changes (e.g., session management)
- Coordinate with backend team for:
  - CSRF token support
  - Session tracking API
  - Any new permission endpoints

### Deployment Strategy
- Use feature flags for risky changes
- Deploy security fixes ASAP
- Deploy other improvements gradually
- Monitor error rates after each deployment

### Team Coordination
- Schedule code reviews for large refactors
- Pair programming for complex security tasks
- Knowledge sharing sessions after major changes

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-04  
**Next Review**: After Sprint 1 completion
