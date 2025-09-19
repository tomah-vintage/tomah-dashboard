<script lang="ts">
  import { MessageCircle, Star } from "@lucide/svelte";
  import { formatMongolianDate } from "$lib/utils/date-utils";

  export let reviews: Array<{
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
  }> = [];
</script>

<section>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold mb-6 flex items-center">
      <MessageCircle class="w-6 h-6 mr-2" />
      Сэтгэгдэл ({reviews.length})
    </h2>
    {#if reviews.length > 0}
      <div class="space-y-4">
        {#each reviews as review (review.id)}
          <div class="border-b pb-4 last:border-b-0">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium">{review.user_name}</span>
              <span class="text-sm text-gray-500">
                {formatMongolianDate(review.created_at)}
              </span>
            </div>
            <div class="flex items-center mb-2">
              {#each Array(5) as _, i (i)}
                <Star
                  class="w-4 h-4 {i < review.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'}"
                />
              {/each}
            </div>
            <p class="text-gray-700">{review.comment}</p>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-8 text-gray-500">
        <MessageCircle class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Сэтгэгдэл байхгүй</p>
      </div>
    {/if}
  </div>
</section>