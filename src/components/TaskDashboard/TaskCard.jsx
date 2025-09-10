import React, { useMemo, useCallback } from 'react';
import {
  Card,
  CardBody,
  Heading,
  Badge,
  HStack,
  Text,
  Select,
  Stack,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateTaskStatusRequest,
} from '../../features/tasks/tasksSlice';
import { selectUpdatingMap } from '../../features/tasks/tasksSelectors';

const priorityColor = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'green',
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const updatingMap = useSelector(selectUpdatingMap);
  const isUpdating = !!updatingMap[task.id];

  const overdue = useMemo(() => {
    if (!task.dueDate) return false;
    const today = new Date().toISOString().slice(0, 10);
    return task.status !== 'done' && task.dueDate < today;
  }, [task.dueDate, task.status]);

  const handleStatusChange = useCallback(
    (e) => {
      const newStatus = e.target.value;
      dispatch(updateTaskStatusRequest({ taskId: task.id, newStatus }));
    },
    [dispatch, task.id]
  );

  return (
    <Card variant="outline" position="relative">
      {isUpdating && (
        <HStack position="absolute" top={2} right={2} spacing={2}>
          <Spinner size="sm" />
          <Text fontSize="xs">Updating...</Text>
        </HStack>
      )}
      <CardBody>
        <Stack spacing={3}>
          <HStack justify="space-between">
            <Heading size="sm">{task.title}</Heading>
            <Badge colorScheme={priorityColor[task.priority] || 'gray'}>
              {task.priority}
            </Badge>
          </HStack>

          <HStack justify="space-between">
            <HStack>
              <Text fontSize="sm" color="gray.500">Assignee:</Text>
              <Text fontSize="sm">{task.assignee}</Text>
            </HStack>

            <HStack>
              <Text fontSize="sm" color="gray.500">Due:</Text>
              <Tooltip label={overdue ? 'Overdue' : 'On track'}>
                <Badge colorScheme={overdue ? 'red' : 'blue'}>
                  {task.dueDate}
                </Badge>
              </Tooltip>
            </HStack>
          </HStack>

          <HStack>
            <Text fontSize="sm" color="gray.500">Status:</Text>
            <Select
              size="sm"
              value={task.status}
              isDisabled={isUpdating}
              onChange={handleStatusChange}
              maxW="200px"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default React.memo(TaskCard);
