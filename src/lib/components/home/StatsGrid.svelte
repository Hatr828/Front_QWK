<script lang="ts">
	let {
		completedTests = 0,
		streakDays = 0,
		avgScore = 0,
		totalMinutes = 0
	} = $props<{
		completedTests: number;
		streakDays: number;
		avgScore: number;
		totalMinutes: number;
	}>();

	function hhmm(mins: number) {
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		return `${h}h ${m}m`;
	}
</script>

<div class="row g-3 mb-4">
	<div class="col-sm-6 col-lg-3 col-12">
		<div class="card h-100 shadow-sm">
			<div class="card-body">
				<div class="text-muted">Completed tests</div>
				<div class="display-6">{completedTests}</div>
			</div>
		</div>
	</div>
	<div class="col-sm-6 col-lg-3 col-12">
		<div class="card h-100 shadow-sm">
			<div class="card-body">
				<div class="text-muted">Current streak</div>
				<div class="display-6">{streakDays} days</div>
			</div>
		</div>
	</div>
	<div class="col-sm-6 col-lg-3 col-12">
		<div class="card h-100 shadow-sm">
			<div class="card-body">
				<div class="text-muted">Avg score</div>
				<div class="display-6">{avgScore}%</div>
			</div>
		</div>
	</div>
	<div class="col-sm-6 col-lg-3 col-12">
		<div class="card h-100 shadow-sm">
			<div class="card-body">
				<div class="text-muted">Time learned</div>
				<div class="display-6">{hhmm(totalMinutes)}</div>
			</div>
		</div>
	</div>
</div>
