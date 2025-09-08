<script lang="ts">
  import type {
    AdminQuestionDraft,
    AdminMCQDraft,
    AdminCodeDraft
  } from '$lib/types/admin';
  import MCQEditor from '$lib/components/admin/MCQEditor.svelte';
  import CodeEditor from '$lib/components/admin/CodeEditor.svelte';

  let {
    index = 0,
    value,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown
  } = $props<{
    index: number;
    value: AdminQuestionDraft;
    onChange?: (v: AdminQuestionDraft) => void;
    onRemove?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
  }>();

  function createMcqDraft(): AdminMCQDraft {
    return {
      type: 'mcq',
      title: '',
      prompt: '',
      multiple: false,
      options: [
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    };
  }

  function createCodeDraft(): AdminCodeDraft {
    return {
      type: 'code',
      title: '',
      prompt: '',
      language: 'javascript',
      starter: ''
    };
  }

  function updateType(t: 'mcq' | 'code') {
    if (t === value.type) return;
    const next: AdminQuestionDraft = t === 'mcq' ? createMcqDraft() : createCodeDraft();
    onChange?.(next);
  }
</script>

<div class="card mb-3 shadow-sm">
  <div class="card-header d-flex justify-content-between align-items-center">
    <div>
      <span class="badge text-bg-secondary me-2">#{index + 1}</span>
      <select
        class="form-select form-select-sm d-inline w-auto"
        value={value.type}
        onchange={(e) => updateType((e.target as HTMLSelectElement).value as 'mcq' | 'code')}
        aria-label="Question type"
      >
        <option value="mcq">Multiple Choice</option>
        <option value="code">Code</option>
      </select>
    </div>
    <div class="btn-group">
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick={onMoveUp} title="Up">↑</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick={onMoveDown} title="Down">↓</button>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick={onRemove} title="Remove">✕</button>
    </div>
  </div>

  <div class="card-body">
    {#if value.type === 'mcq'}
      <MCQEditor value={value as AdminMCQDraft} onChange={(v) => onChange?.(v as AdminQuestionDraft)} />
    {:else}
      <CodeEditor value={value as AdminCodeDraft} onChange={(v) => onChange?.(v as AdminQuestionDraft)} />
    {/if}
  </div>
</div>
