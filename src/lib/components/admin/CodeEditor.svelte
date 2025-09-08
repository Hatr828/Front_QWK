<script lang="ts">
	import type { AdminCodeDraft } from '$lib/types/admin';
	import type { CodeIoTests } from '$lib/types/admin';
	import IoTestsBuilder from '$lib/components/admin/code/IoTestsBuilder.svelte';
	import RawJsonEditor from '$lib/components/admin/code/RawJsonEditor.svelte';

	let { value, onChange } = $props<{
		value: AdminCodeDraft;
		onChange?: (v: AdminCodeDraft) => void;
	}>();

	let tab = $state<'builder' | 'raw'>('builder');

	function emit() {
		onChange?.({ ...value });
	}
	function setTests(obj: CodeIoTests) {
		onChange?.({ ...value, tests: obj }); 
	}
</script>

<div class="mb-3">
	<div class="row g-3">
		<div class="col-md-6 col-12">
			<label class="form-label" for="question-title">Question title</label>
			<input
				id="question-title"
				class="form-control"
				bind:value={value.title}
				oninput={emit}
				placeholder="Implement sumUnique"
			/>
		</div>
		<div class="col-md-6 col-12">
			<label class="form-label" for="question-language">Language</label>
			<select
				id="question-language"
				class="form-select"
				bind:value={value.language}
				onchange={emit}
			>
				<option value="javascript">JavaScript</option>
			</select>
		</div>
	</div>

	<div class="mt-3 mb-3">
		<label class="form-label" for="question-prompt">Prompt</label>
		<textarea
			id="question-prompt"
			class="form-control"
			rows="3"
			bind:value={value.prompt}
			oninput={emit}
			placeholder="Given an array of numbers, return the sum of unique values"
		></textarea>
	</div>

	<div class="mb-3">
		<label class="form-label" for="question-starter">Starter code (optional)</label>
		<textarea
			id="question-starter"
			class="form-control font-monospace"
			rows="8"
			bind:value={value.starter}
			oninput={emit}
			placeholder="// starter code..."
		></textarea>
	</div>

	<hr class="my-3" />

	<ul class="nav nav-tabs">
		<li class="nav-item">
			<button
				class="nav-link {tab === 'builder' ? 'active' : ''}"
				onclick={() => (tab = 'builder')}
				type="button">Builder (JSON I/O)</button
			>
		</li>
		<li class="nav-item">
			<button
				class="nav-link {tab === 'raw' ? 'active' : ''}"
				onclick={() => (tab = 'raw')}
				type="button">Raw JSON</button
			>
		</li>
	</ul>

	<div class="border-top-0 border p-3">
		{#if tab === 'builder'}
			<IoTestsBuilder initial={value.tests} onGenerate={setTests} />
		{:else}
			<RawJsonEditor initial={value.tests} onApply={setTests} />
		{/if}
	</div>
</div>
