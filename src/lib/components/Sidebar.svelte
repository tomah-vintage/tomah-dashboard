<script lang="ts">
	import { page } from '$app/stores';
</script>

<aside class="w-64 bg-gray-800 text-white h-screen">
	<div class="p-4">
		<h1 class="text-2xl font-bold">Tomah</h1>
	</div>
	<nav>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/restaurants'}>
				<a href="/restaurants">Restaurants</a>
			</li>
			<li class:active={$page.url.pathname === '/reports'}><a href="/reports">Reports</a></li>
			<li class:active={$page.url.pathname === '/account'}><a href="/account">Account Settings</a></li>
		</ul>
	</nav>
</aside>

<style>
	li {
		padding: 1rem;
	}
	li.active {
		background-color: #4a5568;
	}
</style>