import React, { useState, useEffect } from 'react';
import './style.css';

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TaskForm = ({ onAddTask, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: formatDate(taskToEdit.dueDate),
        category: taskToEdit.category,
        _id: taskToEdit._id, // Keep ID for update
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(formData);
    setFormData({ title: '', description: '', dueDate: '', category: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2 className="form-title">{taskToEdit ? 'Edit Task' : 'Add Task'}</h2>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="submit-button">
        {taskToEdit ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
