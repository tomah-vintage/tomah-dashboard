<script lang="ts">
	import type { Review } from '$lib/types/review';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Star, Eye, Trash2, MessageSquare } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	export let review: Review;
	export let hideDeleteAction = false;

	const dispatch = createEventDispatcher<{
		view: Review;
		delete: Review;
	}>();

	function getReviewTypeBadgeVariant(type: string) {
		switch (type) {
			case 'SERVICE':
				return 'default';
			case 'TASTE':
				return 'secondary';
			case 'ENVIRONMENT':
				return 'outline';
			default:
				return 'outline';
		}
	}

	function getReviewTypeLabel(type: string) {
		switch (type) {
			case 'SERVICE':
				return 'Service';
			case 'TASTE':
				return 'Taste';
			case 'ENVIRONMENT':
				return 'Environment';
			default:
				return type;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function truncateComment(comment: string, maxLength: number = 100) {
		if (comment.length <= maxLength) return comment;
		return comment.substring(0, maxLength) + '...';
	}

	function handleView() {
		dispatch('view', review);
	}

	function handleDelete() {
		dispatch('delete', review);
	}
</script>

<tr class="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100">
	<td class="px-6 py-5">
		<div class="flex items-center space-x-3">
			<div class="bg-gradient-to-br from-blue-100 to-blue-200 w-10 h-10 rounded-full flex items-center justify-center">
				<span class="text-sm font-semibold text-blue-700">
					{review.user.firstName?.charAt(0)}{review.user.lastName?.charAt(0)}
				</span>
			</div>
			<div class="flex flex-col">
				<div class="text-sm font-semibold text-gray-900">
					{review.user.firstName} {review.user.lastName}
				</div>
				{#if review.user.email}
					<div class="text-xs text-gray-500">{review.user.email}</div>
				{/if}
			</div>
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="flex items-center space-x-2">
			<div class="w-2 h-2 bg-green-400 rounded-full"></div>
			<span class="text-sm font-medium text-gray-900">{review.restaurant.name}</span>
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="flex items-center space-x-3">
			<div class="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
				{#each Array(5) as _, i}
					<Star
						class="w-4 h-4 {i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}"
					/>
				{/each}
			</div>
			<span class="text-sm font-semibold text-gray-700">({review.rating}.0)</span>
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="inline-flex">
			{#if review.reviewType === 'SERVICE'}
				<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
					🛎️ Service
				</span>
			{:else if review.reviewType === 'TASTE'}
				<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
					🍽️ Taste
				</span>
			{:else if review.reviewType === 'ENVIRONMENT'}
				<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
					🏪 Environment
				</span>
			{/if}
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="max-w-xs">
			{#if review.comment}
				<div class="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
					<div class="flex items-start gap-2">
						<MessageSquare class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
						<p class="text-sm text-gray-700 line-clamp-2 leading-relaxed">
							"{truncateComment(review.comment, 120)}"
						</p>
					</div>
				</div>
			{:else}
				<div class="text-xs text-gray-400 italic bg-gray-50 px-3 py-2 rounded-lg">
					No comment provided
				</div>
			{/if}
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
			<div class="font-medium">{formatDate(review.createdAt).split(',')[0]}</div>
			<div class="text-xs text-gray-500">{formatDate(review.createdAt).split(',')[1]}</div>
		</div>
	</td>

	<td class="px-6 py-5">
		<div class="flex items-center gap-2">
			<Button
				variant="secondary"
				on:click={handleView}
				class="h-9 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-200"
			>
				<Eye class="w-4 h-4" />
			</Button>
			{#if !hideDeleteAction}
				<Button
					variant="secondary"
					on:click={handleDelete}
					class="h-9 px-3 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 transition-all duration-200"
				>
					<Trash2 class="w-4 h-4" />
				</Button>
			{/if}
		</div>
	</td>
</tr>