<script lang="ts">
	import { goto } from '$app/navigation';
	import { postJSON } from '$lib/api';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let loading = false;

	function validate() {
		if (!name.trim()) {
			error = 'Name is required.';
		}
		else if (password.length < 6) {
			error = 'Passwords should be at least 6 characters long.';
		}
		else if (password !== confirmPassword) {
			error = 'Passwords do not match.';
		}
		else {
			return true;
		}
		return false;
	}

	async function handleRegister(event: Event) {
		event.preventDefault();
		error = '';
		if (!validate()) return;

		loading = true;
		try {
			const resp = await postJSON<{
				user: { id: number; name: string; email: string; role: string };
				token: string;
			}>('/api/register', {
				name,
				email,
				password,
				password_confirmation: confirmPassword, 
				role: 'user'
			});

			localStorage.setItem('token', resp.token);
			localStorage.setItem('user', JSON.stringify(resp.user));

			await goto('/home');
		} catch (e: any) {
			error = e?.message || 'Registration failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="vh-100 d-flex align-items-center justify-content-center bg-light">
	<div class="card register-card shadow-sm">
		<div class="card-body">
			<h3 class="card-title mb-4 text-center">Register</h3>

			{#if error}
				<div class="alert alert-danger" role="alert">{error}</div>
			{/if}

			<form on:submit|preventDefault={handleRegister}>
				<div class="mb-3">
					<label for="name" class="form-label">Name</label>
					<input
						id="name"
						type="text"
						class="form-control"
						bind:value={name}
						required
						placeholder="Your name"
					/>
				</div>

				<div class="mb-3">
					<label for="email" class="form-label">Email address</label>
					<input
						id="email"
						type="email"
						class="form-control"
						bind:value={email}
						required
						placeholder="you@example.com"
					/>
				</div>

				<div class="mb-3">
					<label for="password" class="form-label">Password</label>
					<input
						id="password"
						type="password"
						class="form-control"
						bind:value={password}
						required
						placeholder="••••••••"
					/>
				</div>

				<div class="mb-3">
					<label for="confirmPassword" class="form-label">Confirm Password</label>
					<input
						id="confirmPassword"
						type="password"
						class="form-control"
						bind:value={confirmPassword}
						required
						placeholder="••••••••"
					/>
				</div>

				<button type="submit" class="btn btn-success w-100" disabled={loading}>
					{#if loading}Processing...{/if}
					{#if !loading}Sign Up{/if}
				</button>
			</form>

			<div class="mt-3 text-center">
				Already have an account? <a href="/login">Sign In</a>
			</div>
		</div>
	</div>
</div>

<style>
	.register-card {
		width: 90vw;
		max-width: 480px;
	}
	@media (min-width: 1200px) {
		.register-card {
			max-width: 768px;
			transform: scale(1.2);
			transform-origin: center;
		}
	}
</style>
