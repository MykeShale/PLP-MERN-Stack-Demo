import React from 'react'
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Button from "../components/Button";

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t =>
    filter === "all" ? true :
    filter === "active" ? !t.completed :
    t.completed
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
        {["all", "active", "completed"].map(f => (
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
        {filteredTasks.map(t => (
          <li
            key={t.id}
            className="flex justify-between items-center mb-2 pl-2 text-white border rounded"
          >
            <span className={t.completed ? "line-through" : ""}>
              {t.text}
            </span>
            <div className="flex gap-2">
              <Button
                variant={t.completed ? "secondary" : "primary"}
                onClick={() => toggleTask(t.id)}
              >
                {t.completed ? "Unmark" : "Complete"}
              </Button>
              <Button variant="danger" onClick={() => deleteTask(t.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
