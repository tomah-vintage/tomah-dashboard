<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "$lib/components/ui/select";
  import { Search, RefreshCcw } from "@lucide/svelte";
  import { OrderStatus, OrderType } from "$lib/types/order";

  export let searchTerm: string = "";
  export let selectedStatus: string = "";
  export let selectedOrderType: string = "";
  export let isLoading: boolean = false;
  export let onApplyFilters: () => void;
  export let onResetFilters: () => void;
  export let onRefresh: () => void;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      onApplyFilters();
    }
  }
</script>

<div class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex flex-wrap gap-4 items-center">
      <div class="flex-1 min-w-64">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <Input
            bind:value={searchTerm}
            placeholder="Search orders by customer name or order ID..."
            class="pl-10"
            on:keydown={handleKeydown}
          />
        </div>
      </div>
      
      <Select bind:value={selectedStatus}>
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
          <SelectItem value={OrderStatus.IN_BOX}>In Box</SelectItem>
          <SelectItem value={OrderStatus.DONE}>Done</SelectItem>
          <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
        </SelectContent>
      </Select>
      
      <Select bind:value={selectedOrderType}>
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          <SelectItem value={OrderType.DINE_IN}>Dine-In</SelectItem>
          <SelectItem value={OrderType.TAKE_OUT}>Take-Out</SelectItem>
        </SelectContent>
      </Select>
      
      <div class="flex gap-2">
        <Button on:click={onApplyFilters} disabled={isLoading}>
          <Search class="w-4 h-4 mr-2" />
          Apply
        </Button>
        <Button variant="secondary" on:click={onResetFilters}>Reset</Button>
        <Button variant="secondary" size="sm" on:click={onRefresh} disabled={isLoading}>
          <RefreshCcw class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</div>