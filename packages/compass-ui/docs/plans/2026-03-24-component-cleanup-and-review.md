# Compass UI Component Cleanup And Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all Storybook stories, align component implementations with the React development rules used in this workspace, and review both components and docs against the repository conventions.

**Architecture:** Keep public APIs stable, prefer minimal targeted refactors over broad rewrites, and treat review findings as the driver for code changes. Work in three streams: codebase audit, stories cleanup, and documentation correction, then converge for repo-wide verification.

**Tech Stack:** React 18, TypeScript, Emotion, Jest, Dumi, tsup, ESLint

---

### Task 1: Audit Scope And Save Baseline

**Files:**

- Modify: `package.json`
- Modify: `docs/plans/2026-03-24-component-cleanup-and-review.md`
- Inspect: `src/**/*.tsx`
- Inspect: `docs/components/*.md`

**Step 1: Enumerate stories, docs, and component entry points**

Run: `rg --files src docs | rg 'stories|docs/components|/index.ts$|\\.tsx$'`
Expected: a concrete file list for cleanup and review.

**Step 2: Check repo scripts and dependencies tied to stories**

Run: `cat package.json`
Expected: know whether Storybook-only scripts and packages can be safely removed.

**Step 3: Record the implementation plan**

Write this plan file and keep it updated if scope changes.

**Step 4: Confirm clean baseline**

Run: `git status --short`
Expected: empty output before edits start.

### Task 2: Review Components In Parallel

**Files:**

- Inspect: `src/**/*.tsx`
- Inspect: `src/**/*.ts`

**Step 1: Dispatch component review subagent**

Ask the subagent to audit all components using `react-development`, with `react-coding-standard` as the base and `react-patterns` only where component organization needs it.

**Step 2: Require concrete findings**

The subagent must return:

- high-priority bugs or React rule violations
- smaller cleanup opportunities worth fixing in this pass
- file paths and line references

**Step 3: Preserve write ownership**

The subagent should analyze only and avoid editing files owned by the main thread unless explicitly reassigned.

### Task 3: Review Docs In Parallel

**Files:**

- Inspect: `docs/components/*.md`
- Inspect: `docs/components/button.md`
- Inspect: `.codex/skills/create-component/references/doc-page-structure.md`

**Step 1: Dispatch docs review subagent**

Ask the subagent to review every component doc against the `create-component` skill and Button doc structure.

**Step 2: Require concrete findings**

The subagent must identify:

- missing required sections
- invalid API table structure
- references to non-public props or Storybook concepts
- example/API mismatches with current public component APIs

**Step 3: Keep edits isolated**

If doc changes are later delegated, restrict ownership to `docs/components/*.md`.

### Task 4: Remove Stories With Safety Checks

**Files:**

- Delete: `src/**/*.stories.tsx`
- Modify: `package.json`

**Step 1: Write a failing guard test only if cleanup changes runtime behavior**

If deleting stories only changes tooling, skip TDD for this task.

**Step 2: Delete every `*.stories.tsx` file**

Remove story files under `src/`.

**Step 3: Remove stale Storybook scripts and packages if nothing references them**

Update `package.json` only after checking that no remaining files rely on Storybook packages.

**Step 4: Verify no stories remain**

Run: `rg --files src | rg '\\.stories\\.tsx$'`
Expected: no output.

### Task 5: Apply Minimal React Optimizations

**Files:**

- Modify: `src/**/*.tsx`
- Modify: `src/**/*.test.tsx`
- Modify: `src/**/*.test.ts`

**Step 1: Select only verified issues**

Use the component review output to choose issues that are:

- real React correctness problems
- render/effect/state organization problems
- maintainability problems small enough for this pass

**Step 2: For each behavior change, write failing tests first**

Run targeted Jest commands and confirm RED before implementation.

**Step 3: Implement the smallest fix**

Prefer local refactors, remove effect misuse, extract tiny helpers, and keep APIs stable.

**Step 4: Re-run targeted tests after each fix**

Use focused Jest commands for the touched component before moving on.

### Task 6: Repair Docs To Match Repo Convention

**Files:**

- Modify: `docs/components/*.md`

**Step 1: Fix structural gaps**

Ensure each page has frontmatter, title, short intro, `## 何时使用`, `## 代码演示`, `## API`, and the common-props reference line.

**Step 2: Fix demo and API accuracy**

Align examples and prop tables with the actual exported component API.

**Step 3: Remove story-oriented wording**

Keep docs focused on public usage and Dumi examples only.

### Task 7: Verify End To End

**Files:**

- Modify: any touched file as needed from failed verification

**Step 1: Run lint**

Run: `npm run lint`
Expected: exit code 0.

**Step 2: Run targeted tests for touched components, then full test suite if feasible**

Run: `npm test -- --runInBand`
Expected: passing suite, or clearly reported blockers if unrelated failures exist.

**Step 3: Run build**

Run: `npm run build`
Expected: exit code 0 and generated `dist/`.

**Step 4: Summarize findings with evidence**

Report:

- what was removed
- what component issues were fixed
- what review findings remain
- exact verification commands and outcomes
