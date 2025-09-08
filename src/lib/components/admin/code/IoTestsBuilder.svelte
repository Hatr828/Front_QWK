<script lang="ts">
	import { onMount } from 'svelte';
	import type { CodeIoTests } from '$lib/types/admin';

	type Equality = 'deep' | 'strict';
	type CaseForm = { argsText: string; expectText: string; throws: boolean };

	// props
	let { initial = undefined, onGenerate } = $props<{
		initial?: CodeIoTests | undefined;
		onGenerate?: (obj: CodeIoTests) => void;
	}>();

	// local state
	let fnName = $state('');
	let equality = $state<Equality>('deep');
	let timeoutMs = $state<string>('');
	let cases = $state<CaseForm[]>([{ argsText: '[]', expectText: 'null', throws: false }]);
	let error = $state('');
	let compactFields = $state(true); // отображать поля в одну строку
	let applying = $state(false); // защита от двойного Apply

	function stringifyField(val: unknown, compact: boolean): string {
		try {
			return compact ? JSON.stringify(val) : JSON.stringify(val, null, 2);
		} catch {
			return '';
		}
	}

	function loadFromInitial(): void {
		if (!initial) return;
		error = '';
		try {
			if (initial.type !== 'io') throw new Error('tests.type must be "io"');
			fnName = String(initial.function ?? '');
			equality = initial.equality === 'strict' ? 'strict' : 'deep';
			timeoutMs = typeof initial.timeoutMs === 'number' ? String(initial.timeoutMs) : '';

			const rawCases = Array.isArray(initial.cases) ? initial.cases : [];
			cases = rawCases.map((c: any) => ({
				argsText: stringifyField(Array.isArray(c?.args) ? c.args : [], compactFields),
				expectText: c?.throws ? '' : stringifyField(c?.expect ?? null, compactFields),
				throws: !!c?.throws
			}));
			if (cases.length === 0) {
				cases = [{ argsText: '[]', expectText: 'null', throws: false }];
			}
		} catch (e: any) {
			error = e?.message || 'Failed to load tests';
		}
	}

	// однократно на маунте — чтобы не ловить цикл при Apply
	onMount(() => {
		loadFromInitial();
	});

	function generate(): void {
		if (applying) return;
		applying = true;
		error = '';
		try {
			const builtCases = cases.map(
				(c: CaseForm, idx: number): { args: unknown[]; expect?: unknown; throws?: true } => {
					let argsParsed: unknown;
					try {
						argsParsed = JSON.parse(c.argsText || '[]');
					} catch {
						throw new Error(`Case #${idx + 1}: args must be a JSON array`);
					}
					if (!Array.isArray(argsParsed)) {
						throw new Error(`Case #${idx + 1}: args must be a JSON array`);
					}
					const argsArr = argsParsed as unknown[];

					if (c.throws) return { args: argsArr, throws: true };

					let expectParsed: unknown;
					try {
						expectParsed = JSON.parse(c.expectText || 'null');
					} catch {
						throw new Error(`Case #${idx + 1}: expect must be valid JSON`);
					}

					return { args: argsArr, expect: expectParsed };
				}
			);

			const timeoutNum =
				timeoutMs.trim() === ''
					? undefined
					: Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) >= 0
						? Number(timeoutMs)
						: (() => {
								throw new Error('timeoutMs must be a non-negative number');
							})();

			const io: CodeIoTests = {
				type: 'io',
				function: fnName.trim(),
				equality,
				...(timeoutNum !== undefined ? { timeoutMs: timeoutNum } : {}),
				cases: builtCases
			};

			onGenerate?.(io); // отдаём ОБЪЕКТ наверх
		} catch (e: any) {
			error = e?.message || 'Invalid tests config';
		} finally {
			// снимаем флаг в микротаске, чтобы не блокировать UI
			setTimeout(() => {
				applying = false;
			}, 0);
		}
	}

	function addCase(): void {
		cases = [...cases, { argsText: '[]', expectText: 'null', throws: false }];
	}

	function removeCase(i: number): void {
		cases = cases.filter((_, idx: number) => idx !== i);
		if (cases.length === 0) addCase();
	}

	function moveCase(i: number, dir: -1 | 1): void {
		const j = i + dir;
		if (j < 0 || j >= cases.length) return;
		const arr = cases.slice();
		[arr[i], arr[j]] = [arr[j], arr[i]];
		cases = arr;
	}

	function reformatFields(): void {
		cases = cases.map((c: CaseForm) => {
			let nextArgs = c.argsText;
			let nextExpect = c.expectText;
			try {
				nextArgs = stringifyField(JSON.parse(c.argsText || '[]'), compactFields);
			} catch {}
			if (!c.throws) {
				try {
					nextExpect = stringifyField(JSON.parse(c.expectText || 'null'), compactFields);
				} catch {}
			} else {
				nextExpect = '';
			}
			return { ...c, argsText: nextArgs, expectText: nextExpect };
		});
	}

	function resetBuilder(): void {
		fnName = '';
		equality = 'deep';
		timeoutMs = '';
		cases = [{ argsText: '[]', expectText: 'null', throws: false }];
		error = '';
	}
</script>

<div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
	<h6 class="mb-0">Tests (JSON I/O)</h6>
	<div class="d-flex align-items-center flex-wrap gap-2">
		<div class="form-check me-2">
			<input
				id="io-compact-fields"
				class="form-check-input"
				type="checkbox"
				bind:checked={compactFields}
				onchange={reformatFields}
			/>
			<label for="io-compact-fields" class="form-check-label">Compact fields</label>
		</div>

		<div class="btn-group">
			<button type="button" class="btn btn-sm btn-outline-secondary" onclick={loadFromInitial}>
				Reload from question
			</button>
			<button type="button" class="btn btn-sm btn-outline-secondary" onclick={resetBuilder}>
				Reset
			</button>
			<button type="button" class="btn btn-sm btn-primary" onclick={generate} disabled={applying}>
				{#if applying}Applying…{/if}{#if !applying}Apply to question{/if}
			</button>
		</div>
	</div>
</div>

<div class="row g-3">
	<div class="col-md-6 col-12">
		<label class="form-label" for="io-function">Function name</label>
		<input
			id="io-function"
			class="form-control"
			value={fnName}
			oninput={(e) => (fnName = (e.target as HTMLInputElement).value)}
			placeholder="sumUnique"
		/>
	</div>
	<div class="col-md-3 col-6">
		<label class="form-label" for="io-equality">Equality</label>
		<select
			id="io-equality"
			class="form-select"
			bind:value={equality}
			onchange={() => {
				/* значение уже в bind:value */
			}}
		>
			<option value="deep">deep</option>
			<option value="strict">strict</option>
		</select>
	</div>
	<div class="col-md-3 col-6">
		<label class="form-label" for="io-timeout">Timeout (ms)</label>
		<input
			id="io-timeout"
			inputmode="numeric"
			class="form-control"
			value={timeoutMs}
			oninput={(e) => (timeoutMs = (e.target as HTMLInputElement).value)}
			placeholder="1500"
		/>
	</div>
</div>

<div class="d-flex justify-content-between align-items-center mt-3 mb-2">
	<h6 class="mb-0">Cases</h6>
	<button type="button" class="btn btn-sm btn-outline-primary" onclick={addCase}>+ Add case</button>
</div>

{#each cases as c, i}
	<div class="card mb-2">
		<div class="card-header d-flex justify-content-between align-items-center">
			<div>
				<span class="badge text-bg-secondary me-2">#{i + 1}</span>
				<div class="form-check d-inline-block ms-1">
					<input
						id={'case-throws-' + i}
						class="form-check-input"
						type="checkbox"
						checked={c.throws}
						onchange={(e) => (cases[i].throws = (e.target as HTMLInputElement).checked)}
					/>
					<label class="form-check-label" for={'case-throws-' + i}>expects exception</label>
				</div>
			</div>
			<div class="btn-group">
				<button
					type="button"
					class="btn btn-sm btn-outline-secondary"
					title="Move up"
					onclick={() => moveCase(i, -1)}
					disabled={i === 0}>↑</button
				>
				<button
					type="button"
					class="btn btn-sm btn-outline-secondary"
					title="Move down"
					onclick={() => moveCase(i, 1)}
					disabled={i === cases.length - 1}>↓</button
				>
				<button
					type="button"
					class="btn btn-sm btn-outline-danger"
					title="Remove"
					onclick={() => removeCase(i)}>✕</button
				>
			</div>
		</div>

		<div class="card-body">
			<div class="mb-2">
				<label class="form-label" for={'case-args-' + i}>args (JSON array)</label>
				<textarea
					id={'case-args-' + i}
					class="form-control font-monospace"
					rows="3"
					value={c.argsText}
					oninput={(e) => (cases[i].argsText = (e.target as HTMLTextAreaElement).value)}
					placeholder="[ [1,2,2,3] ]"
				></textarea>
			</div>

			{#if !c.throws}
				<div class="mb-2">
					<label class="form-label" for={'case-expect-' + i}>expect (JSON)</label>
					<textarea
						id={'case-expect-' + i}
						class="form-control font-monospace"
						rows="2"
						value={c.expectText}
						oninput={(e) => (cases[i].expectText = (e.target as HTMLTextAreaElement).value)}
						placeholder="6"
					></textarea>
				</div>
			{/if}
		</div>
	</div>
{/each}

{#if error}
	<div class="alert alert-danger mt-2">{error}</div>
{/if}
