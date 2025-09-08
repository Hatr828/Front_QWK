<script lang="ts">
	import type { CodeIoTests } from '$lib/types/admin';

	let { initial = undefined, onApply } = $props<{
		initial?: CodeIoTests | undefined;
		onApply?: (obj: CodeIoTests) => void;
	}>();

	let text = $state(initial ? JSON.stringify(initial, null, 2) : '');
	let error = $state('');
	let info = $state('');

	const RAW_PLACEHOLDER =
		'{"type":"io","function":"sumUnique","cases":[{"args":[[1,2,2,3]],"expect":6}]}';

	let tid: any = null;
	function onInput(e: Event) {
		const v = (e.target as HTMLTextAreaElement).value;
		clearTimeout(tid);
		tid = setTimeout(() => {
			text = v;
		}, 120);
	}

	function apply() {
		error = '';
		info = '';
		try {
			if (!text.trim()) throw new Error('JSON is empty');
			const obj = JSON.parse(text);
			if (obj?.type !== 'io') throw new Error('tests.type must be "io"');
			if (!obj?.function) throw new Error('tests.function is required');
			if (!Array.isArray(obj?.cases)) throw new Error('tests.cases must be an array');
			onApply?.(obj as CodeIoTests);
			info = 'Applied';
		} catch (e: any) {
			error = e?.message || 'Invalid JSON';
		}
	}

	function formatPretty() {
		error = '';
		info = '';
		try {
			if (!text.trim()) return;
			const obj = JSON.parse(text);
			text = JSON.stringify(obj, null, 2);
			info = 'Formatted';
		} catch (e: any) {
			error = e?.message || 'Invalid JSON';
		}
	}

	function minify() {
		error = '';
		info = '';
		try {
			if (!text.trim()) return;
			const obj = JSON.parse(text);
			text = JSON.stringify(obj);
			info = 'Minified';
		} catch (e: any) {
			error = e?.message || 'Invalid JSON';
		}
	}
</script>

<div class="d-flex justify-content-between align-items-center mb-2">
	<h6 class="mb-0">Raw JSON</h6>
	<div class="btn-group">
		<button type="button" class="btn btn-sm btn-outline-secondary" onclick={formatPretty}
			>Format</button
		>
		<button type="button" class="btn btn-sm btn-outline-secondary" onclick={minify}>Minify</button>
		<button type="button" class="btn btn-sm btn-primary" onclick={apply}>Apply</button>
	</div>
</div>

<textarea
	class="form-control font-monospace"
	rows="12"
	value={text}
	oninput={onInput}
	spellcheck="false"
	placeholder={RAW_PLACEHOLDER}
></textarea>

{#if error}<div class="text-danger small mt-2">{error}</div>{/if}
{#if !error && info}<div class="text-success small mt-2">{info}</div>{/if}
