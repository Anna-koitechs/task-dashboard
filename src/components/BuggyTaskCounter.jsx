import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Text, Button } from '@chakra-ui/react';

const BuggyTaskCounter = () => {
  const tasks = useSelector(state => state.tasks);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(tasks.length);
  });
  
  const incrementCount = () => {
    count = count + 1;
    setCount(count);
  };
  
  return (
    <Box>
      <Text>Total Tasks: {count}</Text>
      <Button onClick={incrementCount()}>Add Manual Count</Button>
      {tasks.map(task => 
        <Text>{task.title}</Text>
      )}
    </Box>
  );
};
