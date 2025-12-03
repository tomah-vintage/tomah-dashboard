import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { logger } from "$lib/utils/logger";
import { handleError } from "$lib/utils/errors";

// Mock restaurant data for now
const mockRestaurants = [
  {
    id: 1,
    name: "La Rosa Tapas & Tequila Bar",
    logo: "https://tomah2025.s3.us-east-1.amazonaws.com/uploads/434bff3b-3bfd-45c1-b66c-ab49a909d923.webp",
    address: "Gurvan gol tower, 1st floor",
    latitude: "47.9143",
    longitude: "106.9167",
    created_at: "2025-09-07T08:59:48.291355Z",
    updated_at: "2025-09-07T08:59:48.291383Z",
    user_count: 1,
    total_orders: 1,
    total_revenue: 34000.0,
    average_rating: 0.0,
    subscription: {
      id: 1,
      status: "active",
      plan_name: "Basic Plan",
      plan_price: 50000.0,
      plan_interval: "monthly",
      start_date: "2025-09-07T08:59:48.291355Z",
      end_date: "2026-09-07T08:59:48.291355Z",
      renewal_date: "2025-10-07T08:59:48.291355Z",
      trial_end: null,
      cancel_at_period_end: false,
      canceled_at: null,
      days_until_expiry: 316,
      is_expired: false,
      is_due_soon: false,
      latest_invoice: null,
    },
    admin_users: [
      {
        id: 2,
        first_name: "Restaurant",
        last_name: "Manager",
        email: "manager@larosa.mn",
        phone: "88228822",
        profile_img: null,
        created_at: "2025-09-07T09:15:30.125000Z",
        last_login: "2025-10-25T13:36:16.036965Z",
        is_active: true,
      },
    ],
    highlights: [
      {
        id: 1,
        name: "suggested",
        display_name: "Suggested",
        highlight_type: "BADGE",
        color: "#28a745",
      },
      {
        id: 2,
        name: "breakfast",
        display_name: "Breakfast",
        highlight_type: "BADGE",
        color: "#ffc107",
      },
    ],
  },
  {
    id: 2,
    name: "Самар",
    logo: "https://tomah2025.s3.us-east-1.amazonaws.com/uploads/e4490ca0-e745-4194-bf52-0952a78f4419.webp",
    address: "ulaanbaatar",
    latitude: null,
    longitude: null,
    created_at: "2025-10-24T06:13:33.318285Z",
    updated_at: "2025-10-24T06:13:33.318304Z",
    user_count: 0,
    total_orders: 0,
    total_revenue: 0.0,
    average_rating: 0.0,
    subscription: null,
    admin_users: [],
    highlights: [],
  },
];

export const GET: RequestHandler = async ({ url }) => {
  try {
    // Parse pagination parameters
    const page = parseInt(url.searchParams.get("page") || "1");
    const page_size = parseInt(url.searchParams.get("page_size") || "10");
    const offset = (page - 1) * page_size;

    logger.debug("Fetching admin restaurants", {
      context: "admin_restaurants_api",
      page,
      page_size,
      offset,
    });

    const totalCount = mockRestaurants.length;
    const paginatedRestaurants = mockRestaurants.slice(
      offset,
      offset + page_size,
    );

    logger.info("Successfully fetched admin restaurants", {
      context: "admin_restaurants_api",
      count: paginatedRestaurants.length,
      total: totalCount,
    });

    return json({
      count: totalCount,
      next:
        page * page_size < totalCount
          ? `/api/admin/restaurants/?page=${page + 1}&page_size=${page_size}`
          : null,
      previous:
        page > 1
          ? `/api/admin/restaurants/?page=${page - 1}&page_size=${page_size}`
          : null,
      results: paginatedRestaurants,
    });
  } catch (err) {
    const { message, statusCode } = handleError(err, "admin_restaurants_api");
    return json({ error: message }, { status: statusCode || 500 });
  }
};
