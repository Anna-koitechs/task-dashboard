import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    assignee: 'all',
  },
  updating: {}, // { [taskId]: boolean }
  prevStatus: {}, // { [taskId]: string }
  assignees: [], // cached list of all known assignees
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action) {
      state.loading = false;
      state.tasks = action.payload;
      // Update cached assignees with a union of known + from current payload
      const fromPayload = Array.from(
        new Set(action.payload.map((t) => t.assignee).filter(Boolean))
      );
      const union = Array.from(new Set([...(state.assignees || []), ...fromPayload]));
      state.assignees = union;
      // Safety: clear any stale per-task updating flags after a fresh fetch
      state.updating = {};
      state.prevStatus = {};
    },
    fetchTasksFailure(state, action) {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tasks';
      // Safety: avoid stuck spinners on fetch errors
      state.updating = {};
    },

    updateTaskStatusRequest(state, action) {
      const { taskId, newStatus } = action.payload;
      const idx = state.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        if (state.prevStatus[taskId] === undefined) {
          state.prevStatus = { ...state.prevStatus, [taskId]: state.tasks[idx].status };
        }
        state.tasks[idx] = { ...state.tasks[idx], status: newStatus };
      }
      state.updating = { ...state.updating, [taskId]: true };
      state.error = null;
    },
    updateTaskStatusSuccess(state, action) {
      const updated = action.payload; // full task
      const idx = state.tasks.findIndex((t) => t.id === updated.id);
      if (idx !== -1) {
        state.tasks[idx] = updated;
      }
      const { [updated.id]: _removedPrev, ...restPrev } = state.prevStatus;
      state.prevStatus = restPrev;
      state.updating = { ...state.updating, [updated.id]: false };
    },
    updateTaskStatusFailure(state, action) {
      const { taskId, error } = action.payload;
      const prev = state.prevStatus[taskId];
      const idx = state.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1 && prev !== undefined) {
        state.tasks[idx] = { ...state.tasks[idx], status: prev };
      }
      const { [taskId]: _removed, ...rest } = state.prevStatus;
      state.prevStatus = rest;
      state.updating = { ...state.updating, [taskId]: false };
      state.error = error || 'Failed to update task';
    },

    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskStatusRequest,
  updateTaskStatusSuccess,
  updateTaskStatusFailure,
  setFilter,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
