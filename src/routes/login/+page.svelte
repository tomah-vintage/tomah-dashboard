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

<div class="flex min-h-screen items-center justify-center bg-light-gray font-sans">
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-md shadow-light-gray">
		<h2 class="mb-6 text-center text-2xl font-bold text-dark-charcoal">Admin Login</h2>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium text-dark-charcoal"
					>Username:</label
				>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					required
					class="w-full rounded-md border border-gray-300 p-2 focus:border-primary-orange focus:ring focus:ring-primary-orange focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-dark-charcoal"
					>Password:</label
				>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					class="w-full rounded-md border border-gray-300 p-2 focus:border-primary-orange focus:ring focus:ring-primary-orange focus:ring-opacity-50"
				/>
			</div>
			{#if errorMessage}
				<p class="text-sm text-status-error">{errorMessage}</p>
			{/if}
			<button
				type="submit"
				class="w-full rounded-md bg-primary-orange px-4 py-2 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-opacity-50"
				>Login</button
			>
		</form>
	</div>
</div>
