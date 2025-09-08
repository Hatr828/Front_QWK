<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getToken } from '$lib/api';
	import { apiFetchTest, apiSubmitTest } from '$lib/api/test';
	import type {
		TestPayload,
		MCQQuestion,
		CodeQuestion,
		SubmitRequest,
		SubmitAnswer
	} from '$lib/types/test';
	import MCQ from '$lib/components/test/MCQ.svelte';
	import CodeQuestionCmp from '$lib/components/test/CodeQuestion.svelte';
	import QuestionPager from '$lib/components/test/QuestionPager.svelte';

	let { data } = $props<{ data: { id: string } }>();

	let testId = $state(data.id);
	$effect(() => {
		testId = data.id;
	});

	let loading = $state(true);
	let error = $state('');
	let test: TestPayload | null = $state(null);
	let current = $state(0);

	let answers = new Map<number, SubmitAnswer>();
	const storageKey = $derived(`test:${testId}:answers`);

	function loadLocal() {
		try {
			const raw = localStorage.getItem(storageKey);
			if (!raw) return;
			const arr: SubmitAnswer[] = JSON.parse(raw);
			answers = new Map(arr.map((a) => [a.questionId, a]));
		} catch {}
	}
	function saveLocal() {
		const arr = Array.from(answers.values());
		localStorage.setItem(storageKey, JSON.stringify(arr));
	}
	function setAnswer(a: SubmitAnswer) {
		answers.set(a.questionId, a);
		saveLocal();
	}
	function getMCQSelected(q: MCQQuestion) {
		const a = answers.get(q.id);
		return a && a.type === 'mcq' ? a.selected : [];
	}
	function getCodeText(q: CodeQuestion) {
		const a = answers.get(q.id);
		if (a && a.type === 'code') return a.code;
		return q.starter || '';
	}

	onMount(async () => {
		if (!getToken()) {
			goto('/login');
			return;
		}

		loadLocal();

		try {
			test = await apiFetchTest(testId);
		} catch (e: any) {
			error = e?.message || 'Failed to load test';
		} finally {
			loading = false;
		}
	});

	async function submitAll() {
		if (!test) return;
		const payload: SubmitRequest = {
			test: test.test,
			questions: test.questions,
			answers: Array.from(answers.values())
		};
		try {
			const res = await apiSubmitTest(test.test.id, payload);
			alert(`Submitted! Score: ${res.scorePercent}%`);
			localStorage.removeItem(storageKey);
			goto('/home');
		} catch (e: any) {
			alert('Submit failed: ' + (e?.message || 'unknown error'));
		}
	}
</script>

<div class="container py-4">
	{#if loading}
		<div class="d-flex justify-content-center py-5">
			<div class="spinner-border" role="status"></div>
		</div>
	{:else if error}
		<div class="alert alert-danger">{error}</div>
	{:else if test}
		<div class="row align-items-center g-2 mb-3">
			<div class="col">
				<h3 class="mb-1">{test.test.title}</h3>
				<div class="text-muted small">{test.test.description}</div>
			</div>
			<div class="col-auto text-end">
				{#if test.test.difficulty}
					<span class="badge text-bg-light me-2">{test.test.difficulty}</span>
				{/if}
				{#if test.test.estimatedMinutes}
					<span class="badge text-bg-light">~{test.test.estimatedMinutes} min</span>
				{/if}
			</div>
		</div>

		{@const q = test.questions[current]}

		{#if q}
			{#if q.type === 'mcq'}
				<MCQ
					question={q}
					selected={getMCQSelected(q)}
					onChange={(val) => setAnswer({ questionId: q.id, type: 'mcq', selected: val })}
				/>
			{:else}
				<CodeQuestionCmp
					testId={test.test.id}
					question={q}
					code={getCodeText(q)}
					onChange={(code) =>
						setAnswer({ questionId: q.id, type: 'code', language: q.language, code })}
				/>
			{/if}
		{/if}

		<div class="d-flex justify-content-between align-items-center mt-3">
			<button
				class="btn btn-outline-secondary"
				onclick={() => (current = Math.max(0, current - 1))}
				disabled={current === 0}
			>
				← Previous
			</button>

			<button class="btn btn-primary" onclick={submitAll}>Submit</button>

			<button
				class="btn btn-outline-secondary"
				onclick={() => (current = Math.min(test!.questions.length - 1, current + 1))}
				disabled={current >= test.questions.length - 1}
			>
				Next →
			</button>
		</div>

		<QuestionPager total={test.questions.length} {current} onSelect={(i) => (current = i)} />
	{/if}
</div>
