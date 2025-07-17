const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.patch('/reorder', taskController.reorderTasks);
router.delete('/:id', taskController.deleteTask);

module.exports = router; 