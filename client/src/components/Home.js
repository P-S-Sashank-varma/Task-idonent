import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import './style.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tasks');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleMarkCompleted = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });
      setTasks(tasks.map((task) => task._id === id ? { ...task, status: 'completed' } : task));
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    }
  };

  // Handle search and filter logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearchQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? task.category === selectedCategory : true;
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">Task Mate</h1>
      <p className="home-description">Manage your tasks efficiently!</p>

      <TaskForm
        onAddTask={editingTask ? handleUpdateTask : handleAddTask}
        taskToEdit={editingTask}
      />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
  <option value="Work">Work</option>
  <option value="Design">Design</option>
  <option value="Backend">Backend</option>
  <option value="Testing">Testing</option>
  <option value="Optimization">Optimization</option>
  <option value="Personal">Personal</option>
  <option value="Urgent">Urgent</option>
        </select>
      </div>

      <div className="task-list">
        <h2 className="task-list-title">Task List</h2>
        {filteredTasks.length === 0 ? (
          <p>No tasks found!</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-item">
              <div>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <p className="task-due-date">Due Date: {task.dueDate}</p>
                <p className="task-category">Category: {task.category}</p>
                <p className={`task-status ${task.status === 'completed' ? 'completed' : 'in-progress'}`}>
                  Status: {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'No Status'}
                </p>
              </div>

              <div className="task-actions">
                <button
                  onClick={() => handleEditTask(task)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="delete-button"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleMarkCompleted(task._id)}
                  className="complete-button"
                >
                  {task.status === 'completed' ? 'Undo' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
