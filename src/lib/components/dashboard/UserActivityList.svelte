<script lang="ts">
  import type { UserActivity } from "$lib/types/dashboard";
  import { ArrowRight } from "@lucide/svelte";

  export let users: UserActivity[];
  export let onShowAll: (() => void) | undefined = undefined;
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-800">Үйлчлүүлэгч</h2>
    <button 
      type="button" 
      class="text-primary-blue flex items-center text-sm font-medium hover:underline"
      on:click={onShowAll}
      disabled={!onShowAll}
    >
      Бүгдийг харах <ArrowRight class="w-4 h-4 ml-1" />
    </button>
  </div>
  <div class="space-y-4">
    {#each users as user (user.id)}
      <div class="flex items-center space-x-4">
        <img
          src={user.avatarUrl}
          alt={user.name}
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800">{user.name}</h3>
          <p class="text-gray-500 text-sm">{user.email}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-800">{user.activityCount} удаа</p>
          <p class="text-gray-500 text-sm">{user.location}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
