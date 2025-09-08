<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiMe } from '$lib/api/auth';
	import { apiCreateTestFull } from '$lib/api/admin';
	import type {
		AdminTestDraft,
		AdminQuestionDraft,
		AdminCreateTestFullRequest
	} from '$lib/types/admin';
	import QuestionCard from '$lib/components/admin/QuestionCard.svelte';
	import type { CodeIoTests, AdminMCQOptionDraft } from '$lib/types/admin';

	let loading = $state(true);
	let isAdmin = $state(false);
	let saving = $state(false);
	let error = $state('');
	let success = $state('');

	let meta: AdminTestDraft = $state({
		title: '',
		description: '',
		difficulty: '',
		estimatedMinutes: ''
	});
	let questions: AdminQuestionDraft[] = $state([]);

	onMount(async () => {
		try {
			const me = await apiMe();
			if (me.role !== 'admin') {
				goto('/home');
				return;
			}
			isAdmin = true;
		} catch {
			goto('/login');
			return;
		} finally {
			loading = false;
		}
	});

	function isCodeIoTests(x: any): x is CodeIoTests {
		return x && x.type === 'io' && typeof x.function === 'string' && Array.isArray(x.cases);
	}

	function normalizeTests(t: unknown): CodeIoTests | undefined {
		if (!t) return undefined;
		if (typeof t === 'string') {
			try {
				t = JSON.parse(t);
			} catch {
				return undefined;
			}
		}
		return isCodeIoTests(t) ? t : undefined;
	}

	function addQuestion(type: 'mcq' | 'code') {
		questions = [
			...questions,
			type === 'mcq'
				? {
						type: 'mcq',
						title: '',
						prompt: '',
						multiple: false,
						options: [
							{ text: '', correct: false },
							{ text: '', correct: false }
						]
					}
				: { type: 'code', title: '', prompt: '', language: 'javascript', starter: '' }
		];
	}
	function removeQuestion(i: number) {
		questions = questions.filter((_, idx: number) => idx !== i);
	}
	function moveQuestion(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= questions.length) return;
		const arr = questions.slice();
		[arr[i], arr[j]] = [arr[j], arr[i]];
		questions = arr;
	}
	function setQuestion(i: number, v: AdminQuestionDraft) {
		const arr = questions.slice();
		arr[i] = v;
		questions = arr;
	}

	function validate(): string | null {
		if (!meta.title.trim()) return 'Title is required';
		if (
			meta.estimatedMinutes !== '' &&
			(typeof meta.estimatedMinutes !== 'number' || meta.estimatedMinutes < 0)
		)
			return 'Estimated minutes must be non-negative';
		if (questions.length === 0) return 'Add at least one question';
		return null;
	}

	function toPayload(): AdminCreateTestFullRequest {
		return {
			test: {
				title: meta.title.trim(),
				description: meta.description?.trim() || undefined,
				difficulty: meta.difficulty || undefined,
				estimatedMinutes:
					typeof meta.estimatedMinutes === 'number'
						? meta.estimatedMinutes
						: meta.estimatedMinutes
							? Number(meta.estimatedMinutes)
							: undefined
			},
			questions: questions.map((q) =>
				q.type === 'mcq'
					? {
							type: 'mcq',
							title: q.title.trim(),
							prompt: q.prompt.trim(),
							multiple: q.multiple,
							options: q.options.map((o) => o.text.trim()),
							correct: q.options.reduce<number[]>(
								(acc, o, idx) => (o.correct ? (acc.push(idx), acc) : acc),
								[]
							)
						}
					: {
							type: 'code',
							title: q.title.trim(),
							prompt: q.prompt.trim(),
							language: q.language,
							starter: q.starter || undefined,
							tests: normalizeTests(q.tests) 
						}
			)
		};
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const v = validate();
		if (v) {
			error = v;
			success = '';
			return;
		}
		error = '';
		saving = true;
		success = '';
		try {
			const res = await apiCreateTestFull(toPayload());
			success = 'Created!';
			goto(`/test/${res.test.id}`);
		} catch (err: any) {
			error = err?.message || 'Failed to create test';
		} finally {
			saving = false;
		}
	}
</script>

<div class="container py-4">
	{#if loading}
		<div class="d-flex justify-content-center py-5">
			<div class="spinner-border" role="status"></div>
		</div>
	{:else if isAdmin}
		<div class="d-flex align-items-center justify-content-between mb-3">
			<h3 class="mb-0">Create Test</h3>
			<a href="/admin" class="btn btn-outline-secondary">← Back</a>
		</div>

		{#if error}<div class="alert alert-danger">{error}</div>{/if}
		{#if success}<div class="alert alert-success">{success}</div>{/if}

		<form class="card shadow-sm" onsubmit={handleSubmit}>
			<div class="card-body">
				<div class="row g-3">
					<div class="col-md-6 col-12">
						<label class="form-label" for="title">Title</label>
						<input
							id="title"
							class="form-control"
							bind:value={meta.title}
							required
							placeholder="e.g. Async & Arrays Basics"
						/>
					</div>
					<div class="col-md-6 col-12">
						<label class="form-label" for="difficulty">Difficulty</label>
						<select id="difficulty" class="form-select" bind:value={meta.difficulty}>
							<option value="">Select…</option>
							<option value="Beginner">Beginner</option>
							<option value="Intermediate">Intermediate</option>
							<option value="Advanced">Advanced</option>
						</select>
					</div>
					<div class="col-12">
						<label class="form-label" for="description">Description</label>
						<textarea
							id="description"
							class="form-control"
							rows="3"
							bind:value={meta.description}
							placeholder="Short summary"
						></textarea>
					</div>
					<div class="col-md-4 col-12">
						<label class="form-label" for="estimated">Estimated minutes</label>
						<input
							id="estimated"
							type="number"
							min="0"
							class="form-control"
							bind:value={meta.estimatedMinutes}
							placeholder="e.g. 20"
						/>
					</div>
				</div>

				<hr class="my-4" />

				<div class="d-flex justify-content-between align-items-center mb-2">
					<h5 class="mb-0">Questions</h5>
					<div class="btn-group">
						<button type="button" class="btn btn-outline-primary" onclick={() => addQuestion('mcq')}
							>+ Multiple choice</button
						>
						<button
							type="button"
							class="btn btn-outline-primary"
							onclick={() => addQuestion('code')}>+ Code</button
						>
					</div>
				</div>

				{#if questions.length === 0}
					<div class="text-muted">No questions yet — add one.</div>
				{/if}

				{#each questions as q, i}
					<QuestionCard
						index={i}
						value={q}
						onChange={(v) => setQuestion(i, v)}
						onRemove={() => removeQuestion(i)}
						onMoveUp={() => moveQuestion(i, -1)}
						onMoveDown={() => moveQuestion(i, 1)}
					/>
				{/each}
			</div>

			<div class="card-footer d-flex justify-content-end gap-2">
				<a class="btn btn-outline-secondary" href="/admin">Cancel</a>
				<button type="submit" class="btn btn-primary" disabled={saving}>
					{#if saving}Saving…{/if}
					{#if !saving}Create test{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
