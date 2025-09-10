# Documentation

## Architectural Decisions
- Build: Vite + React 18 for fast dev start and a simple `index.html` entry.
- State: Redux Toolkit. The `tasks` slice stores `tasks`, `loading`, `error`, `filters`, and an `updating` map for per-task loading state.
- Side effects: Redux-Saga with isolated workers for fetch/update, retry with exponential backoff, and debounced filter changes handled in sagas.
- Selectors: Reselect for memoized data (`selectAllTasks`, stats by status) plus dedicated `selectFilters` and `selectUpdatingMap` for components/sagas.
- UI: Chakra UI (cards/grid/skeletons/badges). Dark mode via `ColorMode`.
- Optimistic UI: reducer updates status immediately in `updateTaskStatusRequest`; on failure it rolls back using `prevStatus`.
- Code splitting: `TaskDashboard` is lazy-loaded via `React.lazy`/`Suspense`.
- Directory layout: `features/tasks` (slice/sagas/selectors), `components/TaskDashboard` (container and UI), `api` (mock API), `store` (root reducer/saga).

## Completed Requirements
- Redux Store Setup:
  - Slice `tasksSlice.js` with actions: fetch/update (+success/failure), `setFilter`, `clearError`.
  - Reducers for each action and an `initialState` matching the spec.
  - Selectors: `selectAllTasks`, `selectTasksByStatus` (memoized factory), `selectTaskStats`, `selectIsLoading`, `selectError`. Additionally: `selectFilters`, `selectUpdatingMap`.
- Redux Saga Implementation:
  - `fetchTasksSaga` reads current filters, retries up to 3 times with exponential backoff, and reports errors to the store.
  - `updateTaskStatusSaga` confirms optimistic update and rolls back on failure.
  - Debounce of 300ms for filter changes (`debounce(setFilter, 300)`).
  - `watchTasksSaga` composes watchers.
- React Components with Chakra UI:
  - `TaskDashboard` container with heading, view toggle, theme switch, and an ErrorBoundary.
  - `TaskFilters` for status/assignee filters and a Clear action; dispatches Redux actions.
  - `TaskList` supports grid/list view, loading skeletons, empty state, and error with Retry.
  - `TaskCard` shows task details, priority badge, status dropdown, per-task updating spinner, and overdue indicator.
- Bug Fix Challenge:
  - `BuggyTaskCounterFixed.jsx` and explanation in `docs/BUG_FIX.md`.

## Bonus Work Implemented
- Optimization: `React.memo` on `TaskCard`, `useMemo` for derived values, and lazy import of `TaskDashboard`.
- UI: Dark mode support via Chakra (toggle in header).

## Known Limitations and Trade-offs
- Client-side filters: simple API filtering by basic fields; no complex queries.
- Per-task loading: `updating` map improves UX but increases slice complexity.
- No virtualization: for 100+ tasks there may be extra re-renders.
- Node 18+ recommended: Vite 5 works best on newer Node versions; older versions show warnings.
