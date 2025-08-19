<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } '$app/stores';
	import { goto } from '$app/navigation';

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';

	$: if ($page.url.searchParams.has('error')) {
		errorMessage = $page.url.searchParams.get('error') || 'An unknown error occurred.';
	}

	async function handleSubmit() {
		errorMessage = ''; // Clear previous errors
		successMessage = ''; // Clear previous success messages

		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		const response = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		if (response.ok) {
			const data = await response.json();
			successMessage = data.message || 'Registration successful!';
			// Optionally redirect after a short delay or clear form
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} else {
			const errorData = await response.json();
			errorMessage = errorData.message || 'Registration failed. Please try again.';
		}
	}
</script>

<svelte:head>
  <title>Register | Qpick</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-content-background font-sans">
	<div class="w-full max-w-md rounded-lg bg-card-background p-8 shadow-lg">
		<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Register New User</h2>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium text-gray-700"
					>Username:</label
				>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={username}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700"
					>Email:</label
				>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700"
					>Password:</label
				>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700"
					>Confirm Password:</label
				>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					bind:value={confirmPassword}
					required
					class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
				/>
			</div>
			{#if errorMessage}
				<p class="text-sm text-status-error">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="text-sm text-status-success">{successMessage}</p>
			{/if}
			<button
				type="submit"
				class="w-full rounded-lg bg-primary-blue px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
				>Register</button
			>
		</form>
	</div>
</div>
