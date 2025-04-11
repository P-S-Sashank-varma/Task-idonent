// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks (with optional search & category filter)
router.get('/', async (req, res) => {
  const { search, category } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (category) {
    query.category = category;
  }

  try {
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
