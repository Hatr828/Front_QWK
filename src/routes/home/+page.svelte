<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import UserHero from '$lib/components/home/UserHero.svelte';
	import StatsGrid from '$lib/components/home/StatsGrid.svelte';
	import ProgressLineChart from '$lib/components/home/ProgressLineChart.svelte';
	import LanguageDonutChart from '$lib/components/home/LanguageDonutChart.svelte';
	import RecommendedList from '$lib/components/home/RecommendedList.svelte';
	import {
		apiMe,
		apiSummary,
		apiDaily,
		apiLangs,
		apiRecommended,
		type User,
		type Summary,
		type DailyPoint,
		type LangItem,
		type TestItem
	} from '$lib/api/home';
	import { getToken } from '$lib/api';

	let user: User | null = null;
	let summary: Summary | null = null;
	let daily: DailyPoint[] = [];
	let langs: LangItem[] = [];
	let recommended: TestItem[] = [];

	let loading = true;
	let error = '';

	onMount(async () => {
		if (!getToken()) {
			goto('/login');
			return;
		}
		try {
			const [me, sum, dailySeries, langDist, recs] = await Promise.all([
				apiMe(),
				apiSummary(),
				apiDaily('30d'),
				apiLangs(),
				apiRecommended(6)
			]);
			user = (me as any).user ?? (me as User);
			summary = sum;
			daily = Array.isArray(dailySeries) ? dailySeries : (dailySeries.points ?? []);
			langs = Array.isArray(langDist) ? langDist : (langDist.items ?? []);
			recommended = Array.isArray(recs) ? recs : (recs.items ?? []);
		} catch (e: any) {
			error = e?.message || 'Failed to load /home data';
		} finally {
			loading = false;
		}
	});
</script>

<div class="container py-4">
	{#if loading}
		<div class="d-flex justify-content-center py-5">
			<div class="spinner-border" role="status" aria-label="Loading"></div>
		</div>
	{:else if error}
		<div class="alert alert-danger">{error}</div>
	{:else if user && summary}
		<UserHero name={user.name} email={user.email} role={user.role} avatarUrl={user.avatarUrl} />
		<StatsGrid
			completedTests={summary.completedTests}
			streakDays={summary.streakDays}
			avgScore={summary.avgScore}
			totalMinutes={summary.totalMinutes}
		/>
		<div class="row g-3 mb-4">
			<div class="col-lg-8 col-12"><ProgressLineChart data={daily} /></div>
			<div class="col-lg-4 col-12"><LanguageDonutChart data={langs} /></div>
		</div>
		<RecommendedList items={recommended} />
	{/if}
</div>
