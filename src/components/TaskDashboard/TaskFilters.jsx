import React, { useMemo } from 'react';
import { HStack, Select, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../features/tasks/tasksSlice';
import { selectAssignees, selectFilters } from '../../features/tasks/tasksSelectors';

const TaskFilters = () => {
  const dispatch = useDispatch();
  const assigneesCache = useSelector(selectAssignees);
  const filters = useSelector(selectFilters);

  const assignees = useMemo(() => ['all', ...assigneesCache], [assigneesCache]);

  const onStatusChange = (e) => dispatch(setFilter({ status: e.target.value }));
  const onAssigneeChange = (e) => dispatch(setFilter({ assignee: e.target.value }));
  const onClear = () => dispatch(setFilter({ status: 'all', assignee: 'all' }));

  return (
    <HStack spacing={4}>
      <Select value={filters.status} onChange={onStatusChange} maxW="220px">
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </Select>
      <Select value={filters.assignee} onChange={onAssigneeChange} maxW="240px">
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a === 'all' ? 'All Assignees' : a}
          </option>
        ))}
      </Select>
      <Button onClick={onClear} variant="outline">Clear Filters</Button>
    </HStack>
  );
};

export default TaskFilters;
