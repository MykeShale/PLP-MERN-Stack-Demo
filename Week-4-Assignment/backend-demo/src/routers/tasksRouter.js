import { Router } from "express";
import {
  addTask,
  deleteTaskById,
  getTask,
  getTasksById,
  updateTask,
} from "../controllers/tasksController.js";
import { protect } from "../middleware/protect.js";

const router = Router();

// protect all task routes
router.get("/tasks", protect, getTask);
router.get("/task/:id", protect, getTasksById);
router.post("/tasks", protect, addTask);
router.put("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTaskById);



const taskRouter=router;
export default taskRouter;


