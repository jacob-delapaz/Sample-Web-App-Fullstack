import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');


  const fetchTasks = () => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
      .then(res => res.json())
      .then(() => {
        setNewTitle('');
        fetchTasks();
      });
  };

  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks());
  };

  const updateTask = (task) => {
    fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(() => fetchTasks());
  };


  const toggleCompletion = (task) => {
    updateTask({ ...task, completed: !task.completed });
  };


  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (task) => {
    updateTask({ ...task, title: editTitle });
    setEditTaskId(null);
  };


  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>To-Do List</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task)}
            />
            {editTaskId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(task)}>Save</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
                <button onClick={() => startEditing(task)} style={{ marginLeft: '0.5rem' }}>Edit</button>
              </>
            )}
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
