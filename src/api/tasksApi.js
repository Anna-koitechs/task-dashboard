// Simulated API with intentional delays
const MOCK_TASKS = [
  { id: 1, title: 'Review PR #123', status: 'in-progress', priority: 'high', assignee: 'John Doe', dueDate: '2024-02-15' },
  { id: 2, title: 'Update documentation', status: 'todo', priority: 'low', assignee: 'Jane Smith', dueDate: '2024-02-20' },
  { id: 3, title: 'Fix login bug', status: 'done', priority: 'critical', assignee: 'John Doe', dueDate: '2024-02-10' },
  // ... more tasks
];

export const tasksAPI = {
  fetchTasks: (filters = {}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly fail 20% of requests for error handling testing
        if (Math.random() > 0.8) {
          reject(new Error('Failed to fetch tasks'));
        }
        
        let filtered = [...MOCK_TASKS];
        if (filters.status) {
          filtered = filtered.filter(t => t.status === filters.status);
        }
        if (filters.assignee) {
          filtered = filtered.filter(t => t.assignee === filters.assignee);
        }
        // Return copies so Redux state freezing doesn't freeze our data source
        resolve(filtered.map(t => ({ ...t })));
      }, 1500);
    });
  },
  
  updateTaskStatus: (taskId, newStatus) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          reject(new Error('Failed to update task'));
        }
        const idx = MOCK_TASKS.findIndex(t => t.id === taskId);
        if (idx !== -1) {
          const updated = { ...MOCK_TASKS[idx], status: newStatus };
          MOCK_TASKS[idx] = updated;
          resolve({ ...updated });
        } else {
          reject(new Error('Task not found'));
        }
      }, 800);
    });
  },
  
  createTask: (taskData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        MOCK_TASKS.push(newTask);
        resolve(newTask);
      }, 1000);
    });
  }
};
