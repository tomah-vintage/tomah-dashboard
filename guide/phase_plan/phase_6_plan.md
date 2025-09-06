# Step-by-Step SvelteKit Caching Implementation

## Phase 1: Basic In-Memory Cache (Start Here)

### Step 1: Create Basic Cache Utility
**Goal:** Set up a simple in-memory cache for your +server.ts files

**Gemini Prompt:**
```
Create a simple in-memory cache utility for SvelteKit with TypeScript. I need:

1. A cache class with get, set, delete, clear methods
2. TTL (time-to-live) support 
3. Automatic cleanup of expired entries
4. TypeScript interfaces
5. Simple usage example in a +server.ts file

File structure:
- src/lib/cache/memory-cache.ts
- Example usage in src/routes/api/users/+server.ts

Keep it simple and focused on the basics first.
```

### Step 2: Add HTTP Cache Headers
**Goal:** Implement browser caching with proper HTTP headers

**Gemini Prompt:**
```
Add HTTP caching headers to my SvelteKit +server.ts files. I need:

1. A helper function to set cache headers based on data type
2. Different cache strategies:
   - Static data: 1 hour cache
   - Dynamic data: 5 minutes cache
   - User-specific: no-cache
3. ETag support for cache validation
4. Examples for GET endpoints in +server.ts

Show me how to integrate this with the memory cache from the previous step.
```

## Phase 2: Database Query Caching

### Step 3: Database Query Cache Wrapper
**Goal:** Cache expensive database queries

**Gemini Prompt:**
```
Create a database query caching wrapper for SvelteKit. I need:

1. A function that wraps database queries with caching
2. Cache key generation based on query parameters
3. Support for cache invalidation by tags
4. Examples for common database operations (SELECT, INSERT, UPDATE, DELETE)
5. Integration with the memory cache utility

Show examples for both Prisma and raw SQL queries.
File: src/lib/cache/db-cache.ts
```

### Step 4: Cache Invalidation Strategy
**Goal:** Clear cache when data changes

**Gemini Prompt:**
```
Implement cache invalidation for my SvelteKit application. I need:

1. Tag-based cache invalidation system
2. Automatic cache clearing on POST/PUT/DELETE operations
3. Manual cache invalidation methods
4. Cache invalidation in +server.ts examples

Show how to invalidate related caches when data is modified.
Examples for user CRUD operations with proper cache management.
```

## Phase 3: Advanced Caching Features

### Step 5: External API Caching
**Goal:** Cache responses from external APIs

**Gemini Prompt:**
```
Create caching for external API calls in SvelteKit +server.ts. I need:

1. Cache wrapper for fetch() calls to external APIs
2. Different caching strategies:
   - Cache-first
   - Network-first
   - Stale-while-revalidate
3. Error handling and fallback strategies
4. Rate limiting integration
5. Examples in +server.ts files

File: src/lib/cache/api-cache.ts
```

### Step 6: SvelteKit Hooks Integration
**Goal:** Global cache configuration and middleware

**Gemini Prompt:**
```
Create SvelteKit hooks for global caching. I need:

1. hooks.server.ts configuration for caching
2. Request/response caching middleware
3. Cache warming on application startup
4. Global cache configuration
5. Performance metrics collection

Show how to integrate all previous caching utilities into the hooks system.
```

## Phase 4: Monitoring and Optimization

### Step 7: Cache Performance Monitoring
**Goal:** Track cache effectiveness

**Gemini Prompt:**
```
Add performance monitoring to my SvelteKit cache system. I need:

1. Cache hit/miss ratio tracking
2. Memory usage monitoring
3. Performance metrics collection
4. Debug logging for cache operations
5. Simple dashboard or logging output

Integration with existing cache utilities.
File: src/lib/cache/monitoring.ts
```

### Step 8: Environment Configuration
**Goal:** Different cache settings per environment

**Gemini Prompt:**
```
Create environment-based cache configuration for SvelteKit. I need:

1. Different TTL settings for dev/staging/prod
2. Feature flags for enabling/disabling cache layers
3. Memory limits configuration
4. Environment-specific cache strategies
5. Configuration file structure

Files:
- src/lib/cache/config.ts
- .env examples for different environments
```

## Phase 5: Production Optimization

### Step 9: Advanced Cache Strategies
**Goal:** Implement sophisticated caching patterns

**Gemini Prompt:**
```
Implement advanced caching strategies for SvelteKit production use. I need:

1. Background cache refresh
2. Cache warming strategies
3. Cache compression for large objects
4. Distributed cache preparation (Redis-ready)
5. Memory leak prevention
6. Graceful cache degradation

Show production-ready implementations with error handling.
```

### Step 10: Complete Integration Example
**Goal:** Put it all together with real examples

**Gemini Prompt:**
```
Create complete +server.ts examples using all caching features. I need:

1. Complex API endpoint with multiple cache layers
2. CRUD operations with proper cache invalidation  
3. Paginated data with cache strategies
4. File serving with cache headers
5. User-specific data caching
6. Error handling and fallback strategies

Show realistic examples that I can copy and modify for my specific use cases.
```

## Implementation Order

**Week 1:** Steps 1-2 (Basic caching + HTTP headers)
**Week 2:** Steps 3-4 (Database caching + invalidation)
**Week 3:** Steps 5-6 (API caching + hooks)
**Week 4:** Steps 7-8 (Monitoring + configuration)
**Week 5:** Steps 9-10 (Advanced features + integration)

## Quick Start (Do This First)

Start with Step 1 to get immediate benefits:
1. Create the basic memory cache
2. Apply it to your slowest +server.ts endpoint
3. Measure the performance improvement
4. Then proceed with the other steps

Each step builds on the previous ones, so follow the order for best results.
