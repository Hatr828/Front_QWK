<script lang="ts">
	let {
		name = '',
		email = '',
		role = '',
		avatarUrl
	} = $props<{ name: string; email: string; role: string; avatarUrl?: string }>();
</script>

<div class="row align-items-center g-3 mb-4">
	<div class="col-auto">
		<img
			src={avatarUrl || 'https://placehold.co/96x96?text=User'}
			alt="Avatar"
			width="96"
			height="96"
			class="rounded-circle border"
		/>
	</div>
	<div class="col">
		<h2 class="mb-1">Welcome back, {name}!</h2>
		<div class="text-muted">{email} • Role: {role}</div>
	</div>
	<div class="col-auto">
		<a class="btn btn-primary" href="/tests">Continue learning</a>
	</div>
</div>
