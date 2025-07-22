<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let errorMessage = '';

	$: if ($page.url.searchParams.has('error')) {
		errorMessage = $page.url.searchParams.get('error') || 'An unknown error occurred.';
	}

	async function handleSubmit() {
		errorMessage = ''; // Clear previous errors
		const response = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			const data = await response.json();
			// Assuming the backend returns a token or success message
			console.log('Login successful:', data);
			goto('/admin/restaurants'); // Redirect to a protected route
		} else {
			const errorData = await response.json();
			errorMessage = errorData.message || 'Login failed. Please check your credentials.';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#F8F9FA] font-sans">
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg shadow-gray-200">
		<h2 class="mb-6 text-center text-2xl font-bold text-[#2C2C2C]">Admin Login</h2>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium text-[#2C2C2C]"
					>Username:</label
				>
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
				<label for="password" class="mb-2 block text-sm font-medium text-[#2C2C2C]"
					>Password:</label
				>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
				/>
			</div>
			{#if errorMessage}
				<p class="text-sm text-[#F44336]">{errorMessage}</p>
			{/if}
			<button
				type="submit"
				class="w-full rounded-lg bg-[#FF6B35] px-4 py-2 text-white hover:bg-[#E05F2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
				>Login</button
			>
		</form>
	</div>
</div>
