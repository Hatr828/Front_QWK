<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Point } from '$lib/types/home';

	let { data = [] as Point[] } = $props<{ data: Point[] }>();

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
				type: 'line',
				data: {
					labels: data.map((p: Point) => p.date.slice(5)),
					datasets: [
						{
							label: 'Daily score',
							data: data.map((p: Point) => p.score),
							fill: false,
							tension: 0.3,
							pointRadius: 2
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						y: { beginAtZero: true, suggestedMax: 100, title: { display: true, text: 'Score' } },
						x: { title: { display: true, text: 'Day' } }
					},
					plugins: { legend: { display: true } }
				}
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
		chart.data.labels = data.map((p: Point) => p.date.slice(5));
		chart.data.datasets[0].data = data.map((p: Point) => p.score);
		chart.update();
	});
</script>

<div class="card h-100 shadow-sm">
	<div class="card-body">
		<h5 class="card-title mb-3">Progress (last 30 days)</h5>
		<canvas bind:this={canvas} aria-label="Daily progress chart"></canvas>
	</div>
</div>
