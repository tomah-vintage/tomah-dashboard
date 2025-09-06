import { memoryCache } from './memory-cache';
import { cacheConfig } from './config';

// This map stores relationships between tags and cache keys.
// e.g., 'users' tag might map to a set of keys like ['users:all', 'users:page:1']
const tagToKeysMap = new Map<string, Set<string>>();

interface DbCacheOptions {
	key: string;
	tags: string[];
	ttl: number; // TTL in milliseconds
}

/**
 * A wrapper function for caching database queries.
 * It checks for a cached result first. If not found, it executes the query,
 * caches the result, and associates it with the provided tags.
 *
 * @param options - Cache options including a unique key, tags for invalidation, and TTL.
 * @param queryFn - An async function that executes the database query.
 * @returns The result from the cache or the database.
 */
export async function withDbCache<T>(
	options: DbCacheOptions,
	queryFn: () => Promise<T>
): Promise<T> {
	if (!cacheConfig.enabled) {
		return queryFn();
	}

	const { key, tags, ttl } = options;

	// 1. Check cache first
	const cachedResult = memoryCache.get<T>(key);
	if (cachedResult) {
		return cachedResult;
	}

	const freshResult = await queryFn();

	// 3. Store the fresh result in the cache
	memoryCache.set(key, freshResult, ttl);

	// 4. Associate the cache key with its tags for future invalidation
	tags.forEach((tag) => {
		if (!tagToKeysMap.has(tag)) {
			tagToKeysMap.set(tag, new Set());
		}
		tagToKeysMap.get(tag)?.add(key);
	});

	return freshResult;
}

/**
 * Invalidates the cache for a given set of tags.
 * This should be called after a database mutation (CREATE, UPDATE, DELETE).
 *
 * @param tags - An array of tags to invalidate.
 */
export function invalidateDbCacheByTags(tags: string[]): void {

	tags.forEach((tag) => {
		const keysToInvalidate = tagToKeysMap.get(tag);

		if (keysToInvalidate) {
			keysToInvalidate.forEach((key) => {
				memoryCache.delete(key);
			});
			tagToKeysMap.delete(tag);
		}
	});
}

// --- CONCEPTUAL USAGE EXAMPLES ---

/*
// Assume 'prisma' is your Prisma client instance

// EXAMPLE 1: Caching a SELECT query (e.g., getting all users)
async function getAllUsers() {
  const options = {
    key: 'users:all',
    tags: ['users'],
    ttl: 60000 // 1 minute
  };

  return withDbCache(options, () => {
    // This function only runs if the data is not in the cache
    return prisma.user.findMany();
  });
}

// EXAMPLE 2: Caching a SELECT query with parameters
async function getUserById(userId: string) {
  const options = {
    key: `user:${userId}`,
    tags: ['users', `user:${userId}`], // Tag with general and specific tags
    ttl: 300000 // 5 minutes
  };

  return withDbCache(options, () => {
    return prisma.user.findUnique({ where: { id: userId } });
  });
}

// EXAMPLE 3: Invalidating cache after a CREATE operation
async function createUser(data: any) {
  const newUser = await prisma.user.create({ data });

  // Invalidate the general 'users' tag, which will clear caches like 'users:all'
  invalidateDbCacheByTags(['users']);

  return newUser;
}

// EXAMPLE 4: Invalidating cache after an UPDATE operation
async function updateUser(userId: string, data: any) {
  const updatedUser = await prisma.user.update({ where: { id: userId }, data });

  // Invalidate both the general list and the specific user entry
  invalidateDbCacheByTags(['users', `user:${userId}`]);

  return updatedUser;
}

// EXAMPLE 5: Raw SQL query caching
async function getActiveProducts() {
  const options = {
    key: 'products:active',
    tags: ['products'],
    ttl: 60000
  };

  return withDbCache(options, () => {
    // Assume 'db.query' is a function that runs raw SQL
    return db.query('SELECT * FROM products WHERE active = TRUE');
  });
}
*/
