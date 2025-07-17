import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { API_BASE_URL } from "../../config/config";
import toast from "react-hot-toast";
import useMemberStore from "../../store/member.store";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const member=useMemberStore((state)=>state.member);
  const token = member.token;

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/v1/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/v1/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: input, description: "" }),
      });

      const newTask = await res.json();
      if (res.ok) {
        setTasks([...tasks, newTask]);
        setInput("");
        toast.success("Task added ✅");
      } else {
        toast.error(newTask.message || "Failed to add task");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while adding task");
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/v1/task/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const updated = await res.json();
      if (res.ok) {
        setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/v1/task/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId));
        toast.success("Task deleted 🗑️");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Network error while deleting");
    }
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl mb-4 text-white">Task Manager</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 outline-none border-white rounded-2xl bg-white"
          placeholder="Add a new task..."
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <div className="mb-4 flex gap-2">
        {["all", "active", "completed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "secondary"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <ul>
        {filteredTasks.map((t) => (
          <li
            key={t._id}
            className="flex justify-between items-center mb-2 pl-2 text-white border rounded"
          >
            <span className={t.completed ? "line-through" : ""}>{t.title}</span>
            <div className="flex gap-2">
              <Button
                variant={t.completed ? "secondary" : "primary"}
                onClick={() => toggleTask(t)}
              >
                {t.completed ? "Unmark" : "Complete"}
              </Button>
              <Button variant="danger" onClick={() => deleteTask(t._id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
