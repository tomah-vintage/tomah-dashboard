<script lang="ts">
	/**
	 * Unified Circular Loader Component
	 *
	 * A consistent loading spinner used throughout the application.
	 * Supports multiple sizes and color variants.
	 */

	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let color: 'primary' | 'white' | 'blue' | 'indigo' | 'green' | 'red' | 'gray' = 'primary';
	export let className: string = '';

	const sizeClasses = {
		xs: 'w-4 h-4 border-2',
		sm: 'w-6 h-6 border-2',
		md: 'w-8 h-8 border-2',
		lg: 'w-12 h-12 border-[3px]',
		xl: 'w-32 h-32 border-4'
	};

	const colorClasses = {
		primary: 'border-primary-blue',
		white: 'border-white',
		blue: 'border-blue-500',
		indigo: 'border-indigo-600',
		green: 'border-green-600',
		red: 'border-red-600',
		gray: 'border-gray-900'
	};
</script>

<div
	class="animate-spin rounded-full border-t-transparent {sizeClasses[size]} {colorClasses[color]} {className}"
	role="status"
	aria-label="Loading"
>
	<span class="sr-only">Loading...</span>
</div>
