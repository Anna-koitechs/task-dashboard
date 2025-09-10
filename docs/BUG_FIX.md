# Bug Fix Challenge — Explanation

Original component: `src/components/BuggyTaskCounter.jsx`.

Issues fixed in `src/components/BuggyTaskCounterFixed.jsx`:

1) Wrong selector path
- Bug: `const tasks = useSelector(state => state.tasks);` returns the entire tasks slice object, not the tasks array.
- Fix: `const tasks = useSelector(state => state.tasks.tasks);` selects the array.

2) Missing dependency array in useEffect
- Bug: `useEffect` without dependencies runs every render, causing redundant `setCount` calls and potential loops.
- Fix: `useEffect(() => { setCount(tasks.length); }, [tasks]);` updates only when the tasks array changes.

3) Mutating state variable directly
- Bug: `count = count + 1;` mutates the state variable and violates React rules.
- Fix: Use state setter with functional update: `setCount(c => c + 1);`.

4) onClick executed during render
- Bug: `<Button onClick={incrementCount()}>` invokes the function immediately.
- Fix: Pass the function reference: `<Button onClick={incrementCount}>`.

5) Missing React `key` for list items
- Bug: `{tasks.map(task => <Text>{task.title}</Text>)}` lacks `key`.
- Fix: `{tasks.map(task => <Text key={task.id}>{task.title}</Text>)}`.
