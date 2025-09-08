<script lang="ts">
	import type { TestItem } from '$lib/types/home';
	let { items = [] as TestItem[] } = $props<{ items: TestItem[] }>();
</script>

{#if items.length}
	<div class="card mb-5 shadow-sm">
		<div class="card-body">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="card-title mb-0">Recommended for you</h5>
				<a href="/tests" class="btn btn-outline-secondary btn-sm">See all</a>
			</div>
			<div class="row g-3">
				{#each items as t}
					<div class="col-md-6 col-lg-4 col-12">
						<div class="h-100 rounded border p-3">
							<div class="small text-muted">{t.topic}</div>
							<div class="fw-semibold">{t.title}</div>
							<span class="badge text-bg-light mt-2">{t.difficulty}</span>
							<div class="mt-3">
								<a class="btn btn-sm btn-primary w-100" href={`/test/${t.id}`}>Start</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
