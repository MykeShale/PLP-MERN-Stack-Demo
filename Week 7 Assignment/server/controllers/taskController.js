const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, dueDate, priority } = req.body;
    if (!title || typeof title !== 'string' || title.length < 1 || title.length > 100) {
      return res.status(400).json({ success: false, error: 'Title is required (1-100 chars)' });
    }
    // Find the highest order value
    const lastTask = await Task.findOne().sort('-order');
    const order = lastTask ? lastTask.order + 1 : 1;
    const newTask = new Task({ title, order, user: req.user.id });
    if (dueDate) newTask.dueDate = dueDate;
    if (priority) newTask.priority = priority;
    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate, priority } = req.body;
    const update = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 1 || title.length > 100) {
        return res.status(400).json({ success: false, error: 'Title must be 1-100 chars' });
      }
      update.title = title;
    }
    if (completed !== undefined) update.completed = completed;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (priority !== undefined) update.priority = priority;
    const updatedTask = await Task.findOne({ _id: id, user: req.user.id }).exec();
    if (!updatedTask) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: updatedTask });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

// Toggle complete
exports.toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

// Reorder tasks
exports.reorderTasks = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, error: 'ids must be an array' });
    for (let i = 0; i < ids.length; i++) {
      await Task.findByIdAndUpdate(ids[i], { order: i + 1 });
    }
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Task not found' });
  }
}; 