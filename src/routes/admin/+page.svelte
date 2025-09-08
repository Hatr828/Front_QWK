<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiMe } from '$lib/api/auth';

	let loading = $state(true);
	let isAdmin = $state(false);
	let error = $state('');

	onMount(async () => {
		try {
			const me = await apiMe();
			if (me.role === 'admin') isAdmin = true;
			else {
				goto('/home');
				return;
			}
		} catch (e: any) {
			console.error('GET /api/me failed:', e);
			error = e?.message || 'Auth failed';
			goto('/login');
			return;
		} finally {
			loading = false;
		}
	});
</script>

<div class="container py-4">
	{#if loading}
		<div class="d-flex justify-content-center py-5"><div class="spinner-border"></div></div>
	{:else if isAdmin}
		<div class="d-flex justify-content-between align-items-center mb-4">
			<h3 class="mb-0">Admin</h3>
		</div>

		<div class="card shadow-sm">
			<div class="card-body d-flex justify-content-between align-items-center">
				<div>
					<h5 class="card-title mb-1">Tests</h5>
					<div class="text-muted">additional text</div>
				</div>
				<a href="/admin/tests/new" class="btn btn-primary">Create new  test</a>
			</div>
		</div>
	{/if}
</div>
