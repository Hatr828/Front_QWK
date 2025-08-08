<script lang="ts">
	import { goto } from '$app/navigation';
	import { postJSON } from '$lib/api';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleLogin(event: Event) {
		event.preventDefault();
		error = '';

		if (!email.trim() || !password) {
			error = 'Email and password are required.';
			return;
		}

		loading = true;
		try {
			const resp = await postJSON<{
				token: string;
				user?: { id: number; name: string; email: string; role: string };
			}>('/api/login', { email, password });

			localStorage.setItem('token', resp.token);
			if (resp.user) localStorage.setItem('user', JSON.stringify(resp.user));

			await goto('/home');
		} catch (e: any) {
			error = e?.message || 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="vh-100 d-flex align-items-center justify-content-center bg-light">
	<div class="card signin-card shadow-sm">
		<div class="card-body">
			<h3 class="card-title mb-4 text-center">Sign In</h3>

			{#if error}
				<div class="alert alert-danger" role="alert">
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={handleLogin}>
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

				<button type="submit" class="btn btn-primary w-100"> Sign In </button>
			</form>

			<div class="mt-3 text-center">
				Don't have an account?
				<a href="/register">Register</a>
			</div>
		</div>
	</div>
</div>

<style>
	.signin-card {
		width: 90vw;
		max-width: 480px;
	}
	@media (min-width: 1200px) {
		.signin-card {
			max-width: 640px;
			transform: scale(1.2);
			transform-origin: center;
		}
	}
</style>
