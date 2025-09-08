<script lang="ts">
	import type { AdminMCQDraft, AdminMCQOptionDraft } from '$lib/types/admin';

	// props (runes)
	let { value, onChange } = $props<{
		value: AdminMCQDraft;
		onChange?: (v: AdminMCQDraft) => void;
	}>();

	// один источник правды — всегда создаём новый объект
	function update(next: AdminMCQDraft) {
		onChange?.(next);
	}

	function setTitle(t: string) {
		update({ ...value, title: t });
	}

	function setPrompt(p: string) {
		update({ ...value, prompt: p });
	}

	function firstCorrectIndex(): number {
		const i = value.options.findIndex((o: AdminMCQOptionDraft) => o.correct);
		return i >= 0 ? i : -1;
	}

	function setMultiple(m: boolean) {
		// при переключении в single оставляем максимум один correct
		const nextOptions = m
			? value.options
			: value.options.map((o: AdminMCQOptionDraft, idx: number) => ({
					...o,
					correct: o.correct && idx === firstCorrectIndex()
				}));
		update({ ...value, multiple: m, options: nextOptions });
	}

	function setOptionText(i: number, text: string) {
		const next = value.options.map((o: AdminMCQOptionDraft, idx: number) =>
			idx === i ? { ...o, text } : o
		);
		onChange?.({ ...value, options: next });
	}

	function addOption() {
		update({ ...value, options: [...value.options, { text: '', correct: false }] });
	}

	function removeOption(i: number) {
		const next = value.options.filter((_: AdminMCQOptionDraft, idx: number) => idx !== i);
		onChange?.({ ...value, options: next });
	}

	function moveOption(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= value.options.length) return;
		const next = value.options.slice() as AdminMCQOptionDraft[];
		[next[i], next[j]] = [next[j], next[i]];
		onChange?.({ ...value, options: next });
	}

	function toggleCorrect(i: number) {
		const next = value.multiple
			? value.options.map((o: AdminMCQOptionDraft, idx: number) =>
					idx === i ? { ...o, correct: !o.correct } : o
				)
			: value.options.map((o: AdminMCQOptionDraft, idx: number) => ({ ...o, correct: idx === i }));
		onChange?.({ ...value, options: next });
	}

	const groupName = `mcq-${Math.random().toString(36).slice(2)}`;
</script>

<div class="mb-3">
	<div class="row g-3">
		<div class="col-md-6 col-12">
			<label class="form-label" for="mcq-title">Question title</label>
			<input
				id="mcq-title"
				class="form-control"
				value={value.title}
				oninput={(e) => setTitle((e.target as HTMLInputElement).value)}
				placeholder="Which methods do NOT mutate the array?"
			/>
		</div>

		<div class="col-md-6 d-flex align-items-end col-12">
			<div class="form-check">
				<input
					id="mcq-multiple"
					class="form-check-input"
					type="checkbox"
					checked={value.multiple}
					onchange={(e) => setMultiple((e.target as HTMLInputElement).checked)}
				/>
				<label class="form-check-label" for="mcq-multiple">Allow multiple answers</label>
			</div>
		</div>
	</div>

	<div class="mt-3">
		<label class="form-label" for="mcq-prompt">Prompt (optional)</label>
		<textarea
			id="mcq-prompt"
			class="form-control"
			rows="2"
			value={value.prompt}
			oninput={(e) => setPrompt((e.target as HTMLTextAreaElement).value)}
			placeholder="Select all that apply"
		></textarea>
	</div>

	<hr class="my-4" />

	<div class="d-flex justify-content-between align-items-center mb-2">
		<h6 class="mb-0">Options</h6>
		<button type="button" class="btn btn-sm btn-outline-primary" onclick={addOption}
			>+ Add option</button
		>
	</div>

	{#each value.options as opt, i}
		<div class="input-group mb-2">
			<div class="input-group-text">
				<input
					aria-label="Mark as correct"
					class="form-check-input mt-0"
					type={value.multiple ? 'checkbox' : 'radio'}
					name={groupName}
					checked={opt.correct}
					onchange={() => toggleCorrect(i as number)}
				/>
			</div>

			<input
				class="form-control"
				value={opt.text}
				oninput={(e) => setOptionText(i as number, (e.target as HTMLInputElement).value)}
				placeholder={`Option #${(i as number) + 1}`}
			/>

			<button
				type="button"
				class="btn btn-outline-secondary"
				title="Move up"
				onclick={() => moveOption(i as number, -1)}
				disabled={(i as number) === 0}
			>
				↑
			</button>
			<button
				type="button"
				class="btn btn-outline-secondary"
				title="Move down"
				onclick={() => moveOption(i as number, 1)}
				disabled={(i as number) === value.options.length - 1}
			>
				↓
			</button>
			<button
				type="button"
				class="btn btn-outline-danger"
				title="Remove"
				onclick={() => removeOption(i as number)}
			>
				✕
			</button>
		</div>
	{/each}
</div>
