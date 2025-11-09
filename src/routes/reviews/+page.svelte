<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { reviewQueries } from "$lib/queries/review-queries.js";
  import ReviewsTable from "$lib/components/reviews/ReviewsTable.svelte";
  import ReviewsFilters from "$lib/components/reviews/ReviewsFilters.svelte";
  import ReviewDetailModal from "$lib/components/reviews/ReviewDetailModal.svelte";
  import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { Review } from "$lib/types/review";
  import { Star, TrendingUp, MessageSquare, Users } from "@lucide/svelte";

  export let data;

  $: isAdmin = data.user?.role === "ADMIN";
  $: isRestaurantAdmin = data.user?.role === "RESTAURANT";

  let currentPage = 1;
  let pageSize = 10;
  let searchTerm = "";
  let reviewTypeFilter = "";
  let ratingFilter = "";
  let restaurantFilter = "";
  let selectedReview: Review | null = null;
  let showReviewModal = false;

  $: reviewsQuery = createQuery({
    ...reviewQueries.getReviews({
      page: currentPage,
      pageSize,
      search: searchTerm,
      reviewType: reviewTypeFilter,
      rating: ratingFilter,
      restaurant: restaurantFilter,
    }),
    refetchOnWindowFocus: false,
  });

  // Calculate stats from reviews data
  $: reviewsData = $reviewsQuery.data?.results || [];
  $: totalReviews = $reviewsQuery.data?.count || 0;
  $: averageRating =
    reviewsData.length > 0
      ? reviewsData.reduce((sum, review) => sum + review.rating, 0) /
        reviewsData.length
      : 0;
  $: fiveStarReviews = reviewsData.filter(
    (review) => review.rating === 5,
  ).length;

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function handleFiltersChange(
    event: CustomEvent<{
      search: string;
      reviewType: string;
      rating: string;
      restaurant: string;
    }>,
  ) {
    const filters = event.detail;
    searchTerm = filters.search;
    reviewTypeFilter = filters.reviewType;
    ratingFilter = filters.rating;
    restaurantFilter = filters.restaurant;
    currentPage = 1;
  }

  function handleViewReview(event: CustomEvent<Review>) {
    selectedReview = event.detail;
    showReviewModal = true;
  }

  function handleDeleteReview(event: CustomEvent<Review>) {
    // TODO: Implement delete confirmation and API call
    console.log("Шүүмж устгах:", event.detail);
  }

  function handleCloseModal() {
    showReviewModal = false;
    selectedReview = null;
  }
</script>

<svelte:head>
  <title>Шүүмжийн удирдлага - Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">
          Шүүмжийн хяналтын самбар
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {#if isAdmin}
            Бүх рестораны байршлын хэрэглэгчийн санал хүсэлтийг хянах
          {:else}
            Рестораныхаа хэрэглэгчийн сэтгэгдлийг хянах, хариу өгөх
          {/if}
        </p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Нийт шүүмж</p>
            <p class="text-2xl font-bold text-gray-900">{totalReviews}</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <MessageSquare class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Дундаж үнэлгээ</p>
            <div class="flex items-center space-x-2">
              <p class="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
              <div class="flex items-center">
                <Star class="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 p-3 rounded-lg">
            <Star class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">5 одтой шүүмж</p>
            <p class="text-2xl font-bold text-green-600">{fiveStarReviews}</p>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <TrendingUp class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Энэ хуудасны шүүмж</p>
            <p class="text-2xl font-bold text-purple-600">
              {reviewsData.length}
            </p>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <Users class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <ReviewsFilters
        on:filtersChange={handleFiltersChange}
        hideRestaurantFilter={isRestaurantAdmin}
      />
    </div>

    <!-- Reviews Table Section -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {#if $reviewsQuery.isLoading}
        <div class="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      {:else if $reviewsQuery.error}
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <p class="text-red-600 mb-2">Шүүмж ачаалахад алдаа гарлаа</p>
            <p class="text-gray-500 text-sm">{$reviewsQuery.error.message}</p>
            <Button
              variant="tertiary"
              on:click={() => $reviewsQuery.refetch()}
              class="mt-4"
            >
              Дахин оролдоно уу
            </Button>
          </div>
        </div>
      {:else if $reviewsQuery.data}
        <ReviewsTable
          reviews={$reviewsQuery.data.results}
          {currentPage}
          {pageSize}
          totalCount={$reviewsQuery.data.count}
          hideDeleteAction={isRestaurantAdmin}
          on:pageChange={(e) => handlePageChange(e.detail)}
          on:viewReview={handleViewReview}
          on:deleteReview={handleDeleteReview}
        />
      {/if}
    </div>
  </div>
</div>

<ReviewDetailModal
  review={selectedReview}
  isOpen={showReviewModal}
  hideDeleteAction={isRestaurantAdmin}
  on:close={handleCloseModal}
  on:delete={handleDeleteReview}
/>
