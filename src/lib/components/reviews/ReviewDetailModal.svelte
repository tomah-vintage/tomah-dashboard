<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Review } from "$lib/types/review";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import {
    Star,
    User,
    Store,
    MessageSquare,
    Calendar,
    X,
    Trash2,
  } from "@lucide/svelte";

  export let review: Review | null = null;
  export let isOpen = false;
  export let hideDeleteAction = false;

  const dispatch = createEventDispatcher<{
    close: void;
    delete: Review;
  }>();

  function handleClose() {
    dispatch("close");
  }

  function handleDelete() {
    if (review) {
      dispatch("delete", review);
    }
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

  function getReviewTypeLabel(type: string) {
    switch (type) {
      case "SERVICE":
        return "Үйлчилгээ";
      case "TASTE":
        return "Амт";
      case "ENVIRONMENT":
        return "Орчин";
      default:
        return type;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

{#if isOpen}
  <!-- Modal Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    on:click={handleClose}
  >
    <!-- Modal Content -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 border"
      on:click|stopPropagation
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b rounded-t-2xl"
      >
        <div class="flex items-center space-x-3">
          <div
            class="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"
          >
            <MessageSquare class="w-5 h-5 text-white" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Шүүмжийн дэлгэрэнгүй</h2>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
          on:click={handleClose}
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      {#if review}
        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Header with rating and type -->
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center">
                  {#each Array(5) as _, i}
                    <Star
                      class="w-5 h-5 {i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'}"
                    />
                  {/each}
                </div>
                <span class="text-lg font-semibold text-gray-900"
                  >({review.rating}/5)</span
                >
              </div>
              <Badge
                variant={getReviewTypeBadgeVariant(review.reviewType)}
                class="text-sm"
              >
                {getReviewTypeLabel(review.reviewType)}
              </Badge>
            </div>
            {#if !hideDeleteAction}
              <Button
                variant="ghost"
                size="sm"
                on:click={handleDelete}
                class="text-red-600 hover:text-red-900"
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Устгах
              </Button>
            {/if}
          </div>

          <!-- Customer Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <User class="w-5 h-5 text-gray-600" />
              <h3 class="font-semibold text-gray-900">Хэрэглэгчийн мэдээлэл</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <span class="font-medium">Нэр:</span>
                <span class="text-gray-700"
                  >{review.user.firstName} {review.user.lastName}</span
                >
              </div>
              {#if review.user.email}
                <div class="flex items-center gap-2">
                  <span class="font-medium">И-мэйл:</span>
                  <span class="text-gray-700">{review.user.email}</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Restaurant Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <Store class="w-5 h-5 text-gray-600" />
              <h3 class="font-semibold text-gray-900">Ресторан</h3>
            </div>
            <div class="text-sm">
              <span class="text-gray-700 font-medium"
                >{review.restaurant.name}</span
              >
            </div>
          </div>

          <!-- Review Comment -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <MessageSquare class="w-5 h-5 text-gray-600" />
              <h3 class="font-semibold text-gray-900">Сэтгэгдэл</h3>
            </div>
            {#if review.comment}
              <p class="text-gray-700 leading-relaxed">{review.comment}</p>
            {:else}
              <p class="text-gray-400 italic">Сэтгэгдэл байхгүй</p>
            {/if}
          </div>

          <!-- Date Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <Calendar class="w-5 h-5 text-gray-600" />
              <h3 class="font-semibold text-gray-900">Шүүмж бичсэн огноо</h3>
            </div>
            <div class="text-sm text-gray-700">
              <div>Үүсгэсэн: {formatDate(review.createdAt)}</div>
              {#if review.updatedAt && review.updatedAt !== review.createdAt}
                <div class="mt-1">
                  Шинэчилсэн: {formatDate(review.updatedAt)}
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="secondary" on:click={handleClose}>Хаах</Button>
        </div>
      {/if}
    </div>
  </div>
{/if}
