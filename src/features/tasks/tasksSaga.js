import { call, put, takeLatest, takeEvery, delay, select, all, debounce, race } from 'redux-saga/effects';
import { tasksAPI } from '../../api/tasksApi';
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskStatusRequest,
  updateTaskStatusSuccess,
  updateTaskStatusFailure,
  setFilter,
} from './tasksSlice';
import { selectFilters } from './tasksSelectors';


function* fetchTasksSaga() {
  const filters = yield select(selectFilters);
  // Normalize 'all' to undefined so the mock API doesn't filter everything out
  const normalized = { ...filters };
  if (normalized.status === 'all') delete normalized.status;
  if (normalized.assignee === 'all') delete normalized.assignee;

  let attempts = 0;
  const maxAttempts = 3;
  let error;

  while (attempts < maxAttempts) {
    try {
      const tasks = yield call(tasksAPI.fetchTasks, normalized);
      yield put(fetchTasksSuccess(tasks));
      return;
    } catch (err) {
      error = err;
      attempts += 1;
      const ms = 300 * 2 ** (attempts - 1); // exponential backoff: 300, 600, 1200
      yield delay(ms);
    }
  }
  yield put(fetchTasksFailure(error?.message || 'Failed to fetch tasks'));
}

function* updateTaskStatusSaga(action) {
  const { taskId, newStatus } = action.payload;
  let attempts = 0;
  const maxAttempts = 3;
  let lastError;

  while (attempts < maxAttempts) {
    try {
      const { result, timeout } = yield race({
        result: call(tasksAPI.updateTaskStatus, taskId, newStatus),
        timeout: delay(5000), // safety timeout to avoid stuck UI
      });
      if (timeout) throw new Error('Update timed out');
      const updated = result;
      yield put(updateTaskStatusSuccess(updated));
      // Refresh list to ensure UI matches server state and resolves any stale refs
      yield put(fetchTasksRequest());
      return;
    } catch (err) {
      lastError = err;
      attempts += 1;
      yield delay(300 * 2 ** (attempts - 1));
    }
  }

  yield put(
    updateTaskStatusFailure({ taskId, error: lastError?.message || 'Failed to update task' })
  );
}

export function* watchTasksSaga() {
  // Run watchers concurrently at the root level to avoid any accidental blocking
  yield all([
    takeLatest(fetchTasksRequest.type, fetchTasksSaga),
    // Debounce filter changes and then fetch with current filters
    debounce(300, setFilter.type, function* () {
      yield put(fetchTasksRequest());
    }),
    takeEvery(updateTaskStatusRequest.type, updateTaskStatusSaga),
  ]);
}
