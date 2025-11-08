<script lang="ts">
  import { Pencil, Star, DollarSign, Calendar } from "@lucide/svelte";
  import type { AdminRestaurantListItem } from "$lib/types/restaurant";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  export let restaurant: AdminRestaurantListItem;

  function handleRowClick() {
    goto(`${base}/restaurants/${restaurant.id}`);
  }

  function formatRevenue(revenue: number): string {
    return new Intl.NumberFormat('mn-MN').format(revenue) + '₮';
  }

  function getSubscriptionStatusColor(status: string | undefined): string {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getSubscriptionStatusLabel(status: string | undefined): string {
    if (!status) return 'Тодорхойгүй';
    switch (status.toLowerCase()) {
      case 'active':
        return 'Идэвхтэй';
      case 'expired':
        return 'Дууссан';
      case 'canceled':
        return 'Цуцлагдсан';
      case 'trial':
        return 'Туршилт';
      case 'past_due':
        return 'Хэтэрсэн';
      default:
        return status;
    }
  }
</script>

<tr
  class="border-t hover:bg-gray-100 cursor-pointer"
  on:click={handleRowClick}
  on:keydown={(e) =>
    e.key === "Enter" && goto(`${base}/restaurants/${restaurant.id}`)}
  role="button"
  tabindex="0"
>
  <!-- Restaurant Name with Highlights -->
  <td class="p-3 font-medium">
    <div class="flex items-center gap-2">
      <span>{restaurant.name}</span>
      {#if restaurant.highlights && restaurant.highlights.length > 0}
        <div class="flex gap-1">
          {#each restaurant.highlights.slice(0, 2) as highlight}
            <Badge variant="outline" class_="text-xs" style="color: {highlight.color}; border-color: {highlight.color};">
              {highlight.display_name}
            </Badge>
          {/each}
        </div>
      {/if}
    </div>
  </td>

  <!-- Logo -->
  <td class="p-3">
    <img
      src={restaurant.logo}
      alt={restaurant.name}
      class="h-10 w-10 rounded-md object-cover"
      on:error={(e) => {
        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f3f4f6"/><text x="20" y="25" text-anchor="middle" fill="%236b7280" font-size="12">Зураг байхгүй</text></svg>';
      }}
    />
  </td>

  <!-- Revenue -->
  <td class="p-3">
    <div class="flex items-center gap-1">
      <DollarSign class="h-4 w-4 text-green-600" />
      <span class="text-sm font-medium text-green-600">{formatRevenue(restaurant.total_revenue)}</span>
    </div>
  </td>

  <!-- Rating -->
  <td class="p-3">
    <div class="flex items-center gap-1">
      <Star class="h-4 w-4 text-yellow-500 fill-current" />
      <span class="text-sm">{restaurant.average_rating?.toFixed(1) || 'Байхгүй'}</span>
    </div>
  </td>

  <!-- Subscription -->
  <td class="p-3">
    <div class="space-y-1">
      <div class="flex items-center gap-1">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getSubscriptionStatusColor(restaurant.subscription?.status)}">
          {getSubscriptionStatusLabel(restaurant.subscription?.status)}
        </span>
      </div>
      <div class="text-xs text-gray-600">
        {restaurant.subscription?.plan_name || 'Байхгүй'}
      </div>
      <div class="flex items-center gap-1 text-xs text-gray-500">
        <Calendar class="h-3 w-3" />
        {restaurant.subscription?.days_until_expiry || 0} өдөр үлдсэн
      </div>
    </div>
  </td>

  <!-- Created Date -->
  <td class="p-3 text-sm text-gray-600">
    {new Date(restaurant.created_at).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </td>
  <td class="p-3 text-center">
    <div
      on:click|stopPropagation
      on:keydown={(e) => e.key === "Enter" && e.stopPropagation()}
      role="button"
      tabindex="0"
    >
      <a href="{base}/restaurants/{restaurant.id}/edit">
        <Button variant="tertiary" size="sm" class="flex items-center gap-2">
          <Pencil class="h-4 w-4" />
          <span>Засах</span>
        </Button>
      </a>
    </div>
  </td>
</tr>
