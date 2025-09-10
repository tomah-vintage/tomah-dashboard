<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Review } from "$lib/types/review";
  import { Badge } from "$lib/components/ui/badge";
  import { Pagination } from "$lib/components/ui/pagination";
  import ReviewsTableRow from "./ReviewsTableRow.svelte";
  import { Star } from "@lucide/svelte";

  export let reviews: Review[];
  export let currentPage: number;
  export let pageSize: number;
  export let totalCount: number;
  export let hideDeleteAction = false;

  const dispatch = createEventDispatcher<{
    pageChange: number;
    viewReview: Review;
    deleteReview: Review;
  }>();

  $: totalPages = Math.ceil(totalCount / pageSize);

  function handlePageChange(page: number) {
    dispatch("pageChange", page);
  }

  function getReviewTypeBadgeVariant(type: string) {
    switch (type) {
      case "SERVICE":
        return "default";
      case "TASTE":
        return "secondary";
      case "ENVIRONMENT":
        return "outline";
      default:
        return "outline";
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleViewReview(event: CustomEvent<Review>) {
    dispatch("viewReview", event.detail);
  }

  function handleDeleteReview(event: CustomEvent<Review>) {
    dispatch("deleteReview", event.detail);
  }
  console.log("reviews", reviews);
</script>

<div class="overflow-hidden">
  {#if reviews?.length === 0}
    <div class="flex flex-col items-center justify-center py-20">
      <div class="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full mb-6">
        <Star class="w-16 h-16 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
      <p class="text-gray-500 text-center max-w-md">
        It looks like there are no reviews matching your current filters. Try adjusting your search criteria or check back later for new reviews.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>👤</span>
                <span>Customer</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>🏪</span>
                <span>Restaurant</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>⭐</span>
                <span>Rating</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>📂</span>
                <span>Category</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>💬</span>
                <span>Feedback</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>📅</span>
                <span>Date</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center space-x-2">
                <span>⚡</span>
                <span>Actions</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each reviews as review (review.id)}
            <ReviewsTableRow
              {review}
              {hideDeleteAction}
              on:view={handleViewReview}
              on:delete={handleDeleteReview}
            />
          {/each}
        </tbody>
      </table>
    </div>

    <div class="px-6 py-6 border-t bg-gradient-to-r from-gray-50 to-white">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
          Showing <span class="font-bold text-blue-600"
            >{(currentPage - 1) * pageSize + 1}</span
          >
          to
          <span class="font-bold text-blue-600"
            >{Math.min(currentPage * pageSize, totalCount)}</span
          >
          of
          <span class="font-bold text-blue-600">{totalCount}</span> reviews
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-1">
          <Pagination
            {currentPage}
            {totalPages}
            on:pageChange={(e) => handlePageChange(e.detail)}
          />
        </div>
      </div>
    </div>
  {/if}
</div>
