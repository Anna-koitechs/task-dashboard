import { createSelector } from 'reselect';

export const selectTasksState = (state) => state.tasks;

export const selectAllTasks = createSelector(
  (state) => state.tasks.tasks,
  (tasks) => tasks
);

export const selectTasksByStatus = (status) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((t) => t.status === status)
  );

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => {
  const stats = { todo: 0, 'in-progress': 0, done: 0 };
  for (const t of tasks) {
    if (stats[t.status] !== undefined) stats[t.status] += 1;
  }
  return stats;
});

export const selectIsLoading = createSelector(
  (state) => state.tasks.loading,
  (loading) => loading
);

export const selectError = createSelector(
  (state) => state.tasks.error,
  (error) => error
);

export const selectFilters = createSelector(
  (state) => state.tasks.filters,
  (filters) => filters
);

export const selectUpdatingMap = createSelector(
  (state) => state.tasks.updating,
  (updating) => updating
);

export const selectAssignees = createSelector(
  (state) => state.tasks.assignees,
  (assignees) => assignees
);
