import type { PageServerLoad, Actions } from "./$types";
import { apiEndpoints } from "$lib/utils/menu-item-detail";
import { error, fail } from "@sveltejs/kit";
import type { MenuItemDetail } from "$lib/types/menu-item-detail";
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Category } from "$lib/types/category";
import { serverApiFetch } from "$lib/utils/api-call-for-server";

export const load: PageServerLoad = async ({ params, fetch: customFetch }) => {
  const { menuItemId } = params;

  try {
    const menuItemResponse = await serverApiFetch(customFetch, apiEndpoints.getMenuItem(Number(menuItemId)), {
      method: "GET"
    });
    const menuItem = menuItemResponse as MenuItemDetail
    const categoriesResponse = await serverApiFetch(customFetch, `${PUBLIC_BACKEND_URL}/api/item-category/`);
    const categories = categoriesResponse as Category[]

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

      return { success: true, message: "Хоолны зүйл амжилттай шинэчлэгдлээ!" };
    } catch (err) {
      console.error("Error updating menu item:", err);
      return fail(500, { message: "Гэнэтийн алдаа гарлаа." });
    }
  },
};
