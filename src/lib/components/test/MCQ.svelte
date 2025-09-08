<script lang="ts">
	import type { MCQQuestion } from '$lib/types/test';

	let {
		question,
		selected = [] as number[],
		onChange
	} = $props<{ question: MCQQuestion; selected: number[]; onChange?: (val: number[]) => void }>();

	function toggle(id: number) {
		if (question.multiple) {
			const set = new Set(selected);
			set.has(id) ? set.delete(id) : set.add(id);
			selected = Array.from(set);
		} else {
			selected = [id];
		}
		onChange?.(selected);
	}

	const isChecked = (id: number) => selected.includes(id);
</script>

<div class="mb-3">
	<h5 class="mb-1">{question.title}</h5>
	<div class="text-muted mb-3">{question.prompt}</div>

	<div class="list-group">
		{#each question.options as opt}
			<label
				class="list-group-item list-group-item-action d-flex align-items-center"
				class:active={isChecked(opt.id)}
			>
				<input
					class="form-check-input me-2"
					type={question.multiple ? 'checkbox' : 'radio'}
					name={`q_${question.id}`}
					checked={isChecked(opt.id)}
					onchange={() => toggle(opt.id)}
				/>
				<span>{opt.text}</span>
			</label>
		{/each}
	</div>
</div>
