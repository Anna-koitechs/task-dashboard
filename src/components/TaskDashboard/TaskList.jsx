import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  SimpleGrid,
  Stack,
  Skeleton,
  Text,
  Button,
} from '@chakra-ui/react';
import {
  selectAllTasks,
  selectError,
  selectIsLoading,
} from '../../features/tasks/tasksSelectors';
import { fetchTasksRequest } from '../../features/tasks/tasksSlice';
import TaskCard from './TaskCard';

const TaskList = ({ view = 'grid' }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  if (loading) {
    const placeholders = new Array(6).fill(0);
    if (view === 'grid') {
      return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {placeholders.map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="md" />
          ))}
        </SimpleGrid>
      );
    }
    return (
      <Stack spacing={3}>
        {placeholders.map((_, i) => (
          <Skeleton key={i} height="80px" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red.500" mb={2}>{error}</Text>
        <Button onClick={() => dispatch(fetchTasksRequest())}>Retry</Button>
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <Text color="gray.500">No tasks match the current filters.</Text>;
  }

  if (view === 'grid') {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Stack spacing={3}>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </Stack>
  );
};

export default TaskList;

