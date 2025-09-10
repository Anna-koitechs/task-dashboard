import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Text, Button } from '@chakra-ui/react';

const BuggyTaskCounterFixed = () => {
  const tasks = useSelector((state) => state.tasks.tasks); // wrong selector path
  const [count, setCount] = useState(0);

  // added dependency array to useEffect
  useEffect(() => {
    setCount(tasks.length);
  }, [tasks]);

  const incrementCount = useCallback(() => {
    setCount((c) => c + 1); // not mutating state variable directly
  }, []);

  return (
    <Box>
      <Text>Total Tasks: {count}</Text>
      { /* pass function reference instead of calling it immediately */ }
      <Button onClick={incrementCount}>Add Manual Count</Button>
      {tasks.map((task) => (
        <Text key={task.id}>{task.title}</Text> // key is required for list items
      ))}
    </Box>
  );
};

export default BuggyTaskCounterFixed;

