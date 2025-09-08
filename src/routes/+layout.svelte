<script lang="ts">
	import '../app.css';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { setOnUnauthorized, clearToken } from '$lib/api';
	import { goto } from '$app/navigation';

	let { children } = $props();

	setOnUnauthorized(() => {
		clearToken();
		goto('/login');
	});
</script>

{@render children?.()}
