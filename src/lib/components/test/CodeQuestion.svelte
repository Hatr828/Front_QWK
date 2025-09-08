<script lang="ts">
	import type { CodeQuestion } from '$lib/types/test';
	import { apiEvaluateCode } from '$lib/api/test';

	let {
		testId,
		question,
		code = '',
		onChange
	} = $props<{
		testId: string | number;
		question: CodeQuestion;
		code: string;
		onChange?: (code: string) => void;
	}>();

	let running = $state(false);
	let output = $state('');
	let errorMsg = $state('');

	let lastInitFor: number | string | null = $state(null);
	$effect(() => {
		if (!question) return;
		if (lastInitFor !== question.id) {
			lastInitFor = question.id;
			if (!code && question.starter) {
				code = question.starter;
			}
		}
	});

	function update(val: string) {
		code = val;
		onChange?.(code);
	}

	async function run() {
		if (!question) return;
		running = true;
		output = '';
		errorMsg = '';
		try {
			const res = await apiEvaluateCode(testId, question.id, question.language, code);
			output = (res.output || '').trim();
			if (res.feedback) output = (output ? output + '\n' : '') + res.feedback;
		} catch (e: any) {
			// stub
			output = '⟲ Local run mock: tests not available. Code length = ' + code.length;
			errorMsg = e?.message || '';
		} finally {
			running = false;
		}
	}
</script>

<div class="mb-3">
	<h5 class="mb-1">{question.title}</h5>
	<div class="text-muted mb-3">{question.prompt}</div>

	<div class="mb-2">
		<label class="form-label" for="form-control">Language</label>
		<input class="form-control" value={question.language} disabled />
	</div>

	<div class="mb-3">
		<label class="form-label" for="code-editor">Your solution</label>
		<textarea
			id="code-editor"
			class="form-control font-monospace"
			rows="10"
			bind:value={code}
			oninput={(e) => update((e.target as HTMLTextAreaElement).value)}
			placeholder={question.starter || '// write your code here'}
		></textarea>
	</div>

	<div class="d-flex mb-2 gap-2">
		<button
			class="btn btn-outline-primary"
			onclick={(e) => {
				e.preventDefault();
				run();
			}}
			disabled={running}
		>
			{#if running}Running…{/if}
			{#if !running}Run tests{/if}
		</button>
	</div>

	{#if output || errorMsg}
		<div class="card">
			<div class="card-body">
				{#if output}
					<pre class="mb-0"><code>{output}</code></pre>
				{/if}
				{#if errorMsg}
					<div class="text-danger small mt-2">{errorMsg}</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
