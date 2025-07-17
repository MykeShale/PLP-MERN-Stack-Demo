import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import { useEffect, useState, useRef } from 'react';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITIES = [
  { label: 'Low', value: 'low', icon: '⬇️' },
  { label: 'Medium', value: 'medium', icon: '⏺️' },
  { label: 'High', value: 'high', icon: '⬆️' },
];

function ProtectedApp() {
  const { user, logout, token } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  // Dark mode state and effect
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  // Task manager state and logic
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingPriority, setEditingPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const filterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Success message timeout
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 1500);
      return () => clearTimeout(t);
    }
  }, [success]);

  // Add task
  const handleAddTask = async (e: any) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTask, dueDate: newDueDate || undefined, priority: newPriority }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setNewTask('');
      setNewDueDate('');
      setNewPriority('medium');
      setSuccess('Task added!');
      fetchTasks();
    } catch {
      setError('Failed to add task');
    }
  };

  // Delete task
  const handleDelete = async (id: any) => {
    setDeletingId(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setSuccess('Task deleted!');
      fetchTasks();
    } catch {
      setError('Failed to delete task');
    }
  };

  // Toggle complete
  const handleToggle = async (id: any) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setSuccess('Task updated!');
      fetchTasks();
    } catch {
      setError('Failed to update task');
    }
  };

  // Start editing
  const startEdit = (task: any) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
    setEditingDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setEditingPriority(task.priority || 'medium');
  };

  // Save edit
  const handleEdit = async (id: any) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTitle, dueDate: editingDueDate || undefined, priority: editingPriority }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setEditingId(null);
      setEditingTitle('');
      setEditingDueDate('');
      setEditingPriority('medium');
      setSuccess('Task updated!');
      fetchTasks();
    } catch {
      setError('Failed to update task');
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((task: any) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Drag and drop handler
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(filteredTasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(prev => {
      const ids = reordered.map(t => t._id);
      const rest = prev.filter(t => !ids.includes(t._id));
      return [
        ...prev.filter(t => filter !== 'all' ? !filteredTasks.includes(t) : false),
        ...reordered,
        ...rest
      ];
    });
    // Persist order to backend (only for all filter)
    if (filter === 'all') {
      try {
        const res = await fetch(`${API_URL}/reorder`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: reordered.map(t => t._id) }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error();
        setSuccess('Order updated!');
        fetchTasks();
      } catch {
        setError('Failed to update order');
      }
    }
  };

  // Keyboard navigation for filter buttons
  const handleFilterKeyDown = (e: any, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = (idx + 1) % FILTERS.length;
      filterRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = (idx - 1 + FILTERS.length) % FILTERS.length;
      filterRefs.current[prev]?.focus();
    }
  };

  // Helper: is overdue
  const isOverdue = (task: any) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date(new Date().toDateString());
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--bg, #f6f8fa)', display: 'flex', flexDirection: 'column'}}>
      <header style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 0 0', maxWidth: 600, margin: '0 auto', position: 'relative'}}>
        <button
          style={{position: 'relative', left: 0, padding: '8px 20px', borderRadius: 8, border: '1px solid #4f8cff', background: '#fff', color: '#2563eb', fontWeight: 600, marginRight: 8, minWidth: 80, cursor: 'pointer'}}
          onClick={() => setDarkMode(dm => !dm)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button
          style={{position: 'relative', right: 0, padding: '8px 20px', borderRadius: 8, border: '1px solid #e63946', background: '#fff', color: '#e63946', fontWeight: 600, minWidth: 80, cursor: 'pointer'}}
          onClick={logout}
        >
          Logout
        </button>
      </header>
      <main style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 8px'}}>
        <div className="main-container" style={{width: '100%', maxWidth: 600, margin: '32px auto', boxSizing: 'border-box'}}>
          <h1 style={{textAlign: 'center', fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '1.5rem', letterSpacing: 1}}>Task Manager</h1>
          <form style={{marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center'}} onSubmit={handleAddTask} aria-label="Add task form">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              aria-label="Task title"
              style={{flex: 2, minWidth: 120, maxWidth: 220}}
            />
            <input
              type="date"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              title="Due date"
              aria-label="Due date"
              style={{flex: 1, minWidth: 100, maxWidth: 140}}
            />
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value)}
              aria-label="Priority"
              style={{flex: 1, minWidth: 90, maxWidth: 120}}
            >
              {PRIORITIES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!newTask.trim()}
              style={{flex: 1, minWidth: 80, maxWidth: 120, marginTop: 0}}
            >
              Add
            </button>
          </form>
          <div style={{display: 'flex', gap: '8px', marginBottom: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            {FILTERS.map((f, idx) => (
              <button
                key={f.value}
                style={{fontWeight: filter === f.value ? 'bold' : 'normal', padding: '6px 18px', borderRadius: 8, border: filter === f.value ? '2px solid #2563eb' : '1px solid #c9c9c9', background: filter === f.value ? '#e0f2fe' : '#fff', color: filter === f.value ? '#2563eb' : '#222', minWidth: 80, cursor: 'pointer'}}
                onClick={() => setFilter(f.value)}
                aria-label={f.label + ' tasks'}
                ref={el => { filterRefs.current[idx] = el; }}
                tabIndex={0}
                onKeyDown={e => handleFilterKeyDown(e, idx)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          {loading ? (
            <div className="spinner"></div>
          ) : filteredTasks.length === 0 ? (
            <div style={{textAlign: 'center', color: '#888', fontSize: '1.1rem', marginTop: '2rem'}}>No tasks found. Add your first task!</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="task-list">
                {(provided: any) => (
                  <ul style={{listStyle: 'none', padding: 0, margin: 0, width: '100%'}}>
                    {filteredTasks.map((task: any, idx: number) => (
                      <Draggable key={task._id} draggableId={task._id} index={idx}>
                        {(_provided: any, _snapshot: any) => (
                          <li key={task._id} style={{display: 'flex', alignItems: 'center', background: '#f6f8fa', borderRadius: '10px', marginBottom: '12px', padding: '12px 16px', opacity: task.completed ? 0.6 : 1, textDecoration: task.completed ? 'line-through' : 'none', position: 'relative', flexWrap: 'wrap'}}>
                            <span onClick={() => handleToggle(task._id)} style={{flex: 1, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', minWidth: 0}}>
                              {editingId === task._id ? (
                                <>
                                  <input
                                    value={editingTitle}
                                    onChange={e => setEditingTitle(e.target.value)}
                                    onBlur={() => handleEdit(task._id)}
                                    onKeyDown={e => e.key === 'Enter' && handleEdit(task._id)}
                                    autoFocus
                                    aria-label="Edit task title"
                                    style={{minWidth: 80, maxWidth: 180}}
                                  />
                                  <input
                                    type="date"
                                    value={editingDueDate}
                                    onChange={e => setEditingDueDate(e.target.value)}
                                    onBlur={() => handleEdit(task._id)}
                                    aria-label="Edit due date"
                                    style={{minWidth: 80, maxWidth: 120}}
                                  />
                                  <select
                                    value={editingPriority}
                                    onChange={e => setEditingPriority(e.target.value)}
                                    onBlur={() => handleEdit(task._id)}
                                    aria-label="Edit priority"
                                    style={{minWidth: 70, maxWidth: 100}}
                                  >
                                    {PRIORITIES.map(p => (
                                      <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                  </select>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggle(task._id)}
                                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                                    style={{width: '20px', height: '20px'}}
                                  />
                                  <span
                                    style={{fontSize: '1.1rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180}}
                                    onDoubleClick={() => startEdit(task)}
                                    aria-label={task.title}
                                  >
                                    {task.title}
                                  </span>
                                  <span style={{display: 'flex', gap: '8px', marginLeft: '8px', fontSize: '0.95rem', alignItems: 'center', flexWrap: 'wrap'}}>
                                    {task.dueDate && (
                                      <span style={{padding: '2px 8px', borderRadius: '6px', background: '#fffbe6', color: '#b45309', fontWeight: 600, border: isOverdue(task) ? '1px solid #e63946' : undefined}}>
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                    <span style={{padding: '2px 8px', borderRadius: '6px', fontWeight: 600, background: task.priority === 'low' ? '#cffafe' : task.priority === 'medium' ? '#fef9c3' : '#fee2e2', color: task.priority === 'low' ? '#155e75' : task.priority === 'medium' ? '#92400e' : '#991b1b'}}>
                                      {PRIORITIES.find(p => p.value === task.priority)?.icon} {task.priority}
                                    </span>
                                  </span>
                                </>
                              )}
                            </span>
                            <button
                              style={{marginLeft: '8px', background: '#ffe4e6', color: '#be123c', borderRadius: '6px', padding: '4px 8px', border: 'none', minWidth: 40, minHeight: 32, fontSize: 20, fontWeight: 700, cursor: 'pointer'}}
                              aria-label="Delete task"
                              onClick={() => setDeletingId(task._id)}
                            >
                              &times;
                            </button>
                            {deletingId === task._id && (
                              <div style={{position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                                <div style={{background: '#fff', border: '1px solid #e63946', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 1001, flexWrap: 'wrap'}}>
                                  <span style={{color: '#e63946', fontWeight: 600}}>Delete this task?</span>
                                  <button onClick={() => handleDelete(task._id)} style={{background: '#e63946', color: '#fff', borderRadius: '6px', padding: '4px 12px', fontWeight: 600, border: 'none', minWidth: 50}}>Yes</button>
                                  <button onClick={() => setDeletingId(null)} style={{background: '#f3f3f3', color: '#222', borderRadius: '6px', padding: '4px 12px', fontWeight: 600, border: 'none', minWidth: 50}}>No</button>
                                </div>
                              </div>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
