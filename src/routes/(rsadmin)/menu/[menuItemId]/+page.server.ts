import type { PageServerLoad, Actions } from "./$types";
import { apiEndpoints } from "$lib/utils/menu-item-detail";
import { error, fail } from "@sveltejs/kit";
import type { MenuItemDetail } from "$lib/types/menu-item-detail";
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Category } from "$lib/types/category";
import { serverApiFetch } from "$lib/utils/api-call-for-server";
import { withDbCache, invalidateDbCacheByTags } from '$lib/cache/db-cache';
import { generateETag } from '$lib/cache/http-cache'; // Removed setCacheHeaders import
import { cacheConfig } from '$lib/cache/config';

export const load: PageServerLoad = async ({ params, fetch: customFetch, request, setHeaders }) => {
  const { menuItemId } = params;

  try {
    // Cache for MenuItemDetail
    const menuItemCacheKey = `menuItem:${menuItemId}`;
    const menuItemCacheTags = ['menuItems', menuItemCacheKey];
    const menuItem = await withDbCache(
      { key: menuItemCacheKey, tags: menuItemCacheTags, ttl: cacheConfig.ttl.dynamic },
      () => serverApiFetch(customFetch, apiEndpoints.getMenuItem(Number(menuItemId)), { method: "GET" })
    ) as MenuItemDetail;

    // Cache for Categories
    const categoriesCacheKey = 'categories:all';
    const categoriesCacheTags = ['categories'];
    const categories = await withDbCache(
      { key: categoriesCacheKey, tags: categoriesCacheTags, ttl: cacheConfig.ttl.dynamic },
      () => serverApiFetch(customFetch, `${PUBLIC_BACKEND_URL}/api/item-category/`)
    ) as Category[];

    // Combine data for ETag
    const combinedData = { menuItem, categories };
    const etag = generateETag(JSON.stringify(combinedData));

    // Check client's ETag for 304 response first
    const clientETag = request.headers.get('if-none-match');
    const isNotModified = clientETag === etag;

    // Set HTTP cache headers once
    setHeaders({
      'ETag': etag,
      'Cache-Control': `public, max-age=${cacheConfig.ttl.dynamic / 1000}`, // Convert ms to seconds
      ...(isNotModified && { 'Status': '304' })
    });

    // Always return a plain object (even for 304, the client will use cached data)
    return { menuItem, categories };

  } catch (err) {
    console.error("Error loading menu item or categories:", err);
    throw error(500, "Дотоод серверийн алдаа");
  }
};

export const actions: Actions = {
  updateMenuItem: async ({ request, params, fetch: customFetch }) => {
    const { menuItemId } = params;
    const formData = await request.json();

    try {
      await serverApiFetch(customFetch,
        apiEndpoints.updateMenuItem(Number(menuItemId)),
        { 
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Invalidate relevant caches after update
      invalidateDbCacheByTags(['menuItems', `menuItem:${menuItemId}`, 'categories']);

      return { success: true, message: "Хоолны зүйл амжилттай шинэчлэгдлээ!" };
    } catch (err) {
      console.error("Error updating menu item:", err);
      return fail(500, { message: "Гэнэтийн алдаа гарлаа." });
    }
  },
};
