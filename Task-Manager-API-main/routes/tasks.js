const express = require('express');
const Task = require('../models/task');
const router = express.Router();

// POST /tasks - Add a new task
router.post('/', async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    const task = new Task({ title, description, status, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err.message });
  }
});

// GET /tasks - Retrieve all tasks
router.get('/', async (req, res) => {
  const { status, dueDate } = req.query;

  let filter = {};
  if (status) {
    filter.status = status;
  }
  if (dueDate) {
    filter.dueDate = { $lte: new Date(dueDate) };
  }

  try {
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// GET /tasks/:id - Retrieve a specific task by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Invalid task ID', error: err.message });
  }
});

// PUT /tasks/:id - Update task details by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { title, description, status, dueDate }, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err.message });
  }
});

// DELETE /tasks/:id - Delete a task by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting task', error: err.message });
  }
});

module.exports = router;
