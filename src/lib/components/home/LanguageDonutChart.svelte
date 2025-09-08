<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Slice } from '$lib/types/home';

	let { data = [] as Slice[] } = $props<{ data: Slice[] }>();

	let canvas: HTMLCanvasElement;
	let chart: any = null;
	let ChartCtor: any = null;

	async function ensureCtor() {
		if (!ChartCtor) {
			const mod = await import('chart.js/auto');
			ChartCtor = mod.default;
		}
		return ChartCtor;
	}

	onMount(() => {
		if (!browser) return;
		let disposed = false;

		(async () => {
			const Ctor = await ensureCtor();
			if (disposed) return;

			chart?.destroy();
			chart = new Ctor(canvas, {
				type: 'doughnut',
				data: {
					labels: data.map((d: Slice) => d.language),
					datasets: [{ data: data.map((d: Slice) => d.percent) }]
				},
				options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
			});
		})();

		return () => {
			disposed = true;
			chart?.destroy();
			chart = null;
		};
	});

	$effect(() => {
		if (!browser || !chart) return;
		chart.data.labels = data.map((d: Slice) => d.language);
		chart.data.datasets[0].data = data.map((d: Slice) => d.percent);
		chart.update();
	});
</script>

<div class="card h-100 shadow-sm">
	<div class="card-body">
		<h5 class="card-title mb-3">By language</h5>
		<canvas bind:this={canvas} aria-label="Language distribution chart"></canvas>
	</div>
</div>
