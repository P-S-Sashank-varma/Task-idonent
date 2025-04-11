// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  category: String,
  completed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
