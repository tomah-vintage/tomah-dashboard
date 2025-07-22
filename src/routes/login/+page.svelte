<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let username = '';
	let password = '';
</script>

<div class="flex min-h-screen items-center justify-center bg-[#F8F9FA] font-sans">
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg shadow-gray-200">
		<h2 class="mb-6 text-center text-2xl font-bold text-[#2C2C2C]">Admin Login</h2>
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium text-[#2C2C2C]">Username:</label>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-[#2C2C2C]">Password:</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
				/>
			</div>
			{#if $page.form?.incorrect}
				<p class="text-sm text-[#F44336]">Invalid username or password.</p>
			{/if}
			{#if $page.form?.invalid}
				<p class="text-sm text-[#F44336]">Username and password are required.</p>
			{/if}
			<button
				type="submit"
				class="w-full rounded-lg bg-[#FF6B35] px-4 py-2 text-white hover:bg-[#E05F2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
				>Login</button
			>
		</form>
	</div>
</div>
