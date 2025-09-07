<script lang="ts">
	
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

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
				goto(`${base}/login`);
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
			<Input id="username" name="username" label="Username:" type="text" bind:value={username} required />
			<Input id="email" name="email" label="Email:" type="email" bind:value={email} required />
			<Input id="password" name="password" label="Password:" type="password" bind:value={password} required />
			<Input id="confirmPassword" name="confirmPassword" label="Confirm Password:" type="password" bind:value={confirmPassword} required />
			{#if errorMessage}
				<p class="text-sm text-status-error">{errorMessage}</p>
			{/if}
			{#if successMessage}
				<p class="text-sm text-status-success">{successMessage}</p>
			{/if}
			<Button type="submit" class="w-full">Бүртгүүлэх</Button>
		</form>
	</div>
</div>