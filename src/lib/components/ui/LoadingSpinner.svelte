<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: string = 'text-blue-600';

	const sizes = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	};
</script>

<div class="flex items-center justify-center">
	<div class="animate-spin rounded-full border-2 border-gray-300 border-t-current {sizes[size]} {color}"></div>
</div>