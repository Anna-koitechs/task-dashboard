import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Heading,
  HStack,
  VStack,
  Button,
  IconButton,
  useColorMode,
  Text,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksRequest } from '../../features/tasks/tasksSlice';
import { selectError } from '../../features/tasks/tasksSelectors';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.error('ErrorBoundary:', err);
  }
  render() {
    if (this.state.hasError) {
      return <Box p={6} bg="red.50" _dark={{ bg: 'red.900' }}>Something went wrong.</Box>;
    }
    return this.props.children;
  }
}

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const { toggleColorMode } = useColorMode();
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  const title = useMemo(() => 'Task Management Dashboard', []);

  return (
    <ErrorBoundary>
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{title}</Heading>
          <HStack>
            <IconButton
              aria-label="Toggle view"
              icon={view === 'grid' ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setView((v) => (v === 'grid' ? 'list' : 'grid'))}
            />
            <Button variant="ghost" onClick={toggleColorMode}>Theme</Button>
          </HStack>
        </HStack>

        <TaskFilters />
        {error && (
          <Box p={3} bg="orange.50" borderRadius="md" _dark={{ bg: 'orange.900' }}>
            <Text color="orange.800" _dark={{ color: 'orange.100' }}>{error}</Text>
          </Box>
        )}
        <Divider />
        <TaskList view={view} />
      </VStack>
    </ErrorBoundary>
  );
};

export default TaskDashboard;

