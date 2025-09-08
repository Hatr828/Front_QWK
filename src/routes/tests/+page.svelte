<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { apiListTests } from '$lib/api/test';
	import type { TestMeta } from '$lib/types/test';

	let loading = $state<boolean>(true);
	let q = $state<string>('');
	let rows = $state<TestMeta[]>([]);

	$effect(() => {
		if (!browser) return;

		let canceled = false;

		(async () => {
			try {
				const list = await apiListTests();
				if (canceled) return;
				rows = list;
				loading = false; 
			} catch {
			}
		})();

		return () => {
			canceled = true;
		};
	});

	function filtered(): TestMeta[] {
		const term = q.trim().toLowerCase();
		if (!term) return rows;
		return rows.filter(
			(m) =>
				(m.title ?? '').toLowerCase().includes(term) ||
				(m.description ?? '').toLowerCase().includes(term)
		);
	}

	function openTest(id: number | string): void {
		goto(`/test/${id}`);
	}
</script>

<div class="container py-4">
	<div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
		<h3 class="mb-0">Tests</h3>
		<div class="input-group" style="max-width: 360px;">
			<span class="input-group-text">Search</span>
			<input
				class="form-control"
				placeholder="title or description…"
				value={q}
				oninput={(e) => (q = (e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>

	{#if loading}
		<div class="d-flex justify-content-center py-5">
			<div class="spinner-border" role="status"></div>
		</div>
	{:else}
		<div class="table-responsive">
			<table class="table-hover table align-middle">
				<thead class="table-light">
					<tr>
						<th style="width: 72px;">ID</th>
						<th>Title</th>
						<th>Description</th>
						<th style="width: 140px;">Difficulty</th>
						<th style="width: 160px;">Est. minutes</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered() as m}
						<tr role="button" onclick={() => openTest(m.id)}>
							<td class="text-muted">{m.id}</td>
							<td class="fw-semibold">{m.title}</td>
							<td class="text-truncate" style="max-width: 420px;">{m.description}</td>
							<td
								>{#if m.difficulty}<span class="badge text-bg-light">{m.difficulty}</span>{/if}</td
							>
							<td>{m.estimatedMinutes ?? '—'}</td>
						</tr>
					{/each}
					{#if filtered().length === 0}
						<tr><td colspan="5" class="text-muted py-4 text-center">No tests</td></tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>
