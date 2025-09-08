<script lang="ts">
	let {
		total = 1,
		current = 0,
		onSelect
	} = $props<{ total: number; current: number; onSelect?: (idx: number) => void }>();

	function goto(i: number) {
		onSelect?.(i);
	}
</script>

<div class="d-flex justify-content-center flex-wrap gap-2 py-3">
	{#each Array.from({ length: total }) as _, i}
		<button
			class="btn btn-outline-secondary rounded-circle position-relative"
			aria-label={`Go to question ${i + 1}`}
			onclick={() => goto(i)}
			style={`width:${i === current ? 48 : 36}px;height:${i === current ? 48 : 36}px;`}
		>
			<span class="position-absolute translate-middle fw-semibold start-50 top-50">
				{i + 1}
			</span>
		</button>
	{/each}
</div>
