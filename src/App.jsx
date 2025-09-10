import React, { Suspense, lazy } from 'react';
import { Box, Container, Skeleton } from '@chakra-ui/react';

const TaskDashboard = lazy(() => import('./components/TaskDashboard/TaskDashboard'));

const App = () => {
  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="6xl" py={8}>
        <Suspense fallback={<Skeleton height="200px" borderRadius="md" />}> 
          <TaskDashboard />
        </Suspense>
      </Container>
    </Box>
  );
};

export default App;
