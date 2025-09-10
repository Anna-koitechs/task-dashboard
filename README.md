# Task Management Dashboard

A small React + Redux Toolkit + Redux Saga + Chakra UI application implementing a Task Management Dashboard per the assessment spec.

## Setup

Prerequisites: Node 18+.

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  api/tasksApi.js
  components/
    TaskDashboard/
      TaskDashboard.jsx
      TaskFilters.jsx
      TaskList.jsx
      TaskCard.jsx
    BuggyTaskCounter.jsx           # original buggy version (reference)
    BuggyTaskCounterFixed.jsx      # fixed component used for explanation
  features/
    tasks/
      tasksSlice.js
      tasksSelectors.js
      tasksSaga.js
  store/
    index.js
    rootReducer.js
    rootSaga.js
  theme/
    index.js
  App.jsx
  main.jsx
```

## Notes

- Uses optimistic updates for status changes with rollback on failure.
- Sagas implement retries with exponential backoff and 300ms debounce on filter changes.
- UI uses Chakra components with light/dark theme toggle.

See `docs/BUG_FIX.md` for the bug explanations.

