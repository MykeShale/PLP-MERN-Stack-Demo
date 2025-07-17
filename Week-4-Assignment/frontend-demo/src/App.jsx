import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import ApiData from './pages/ApiData';
import Layout from './components/Layout';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/tasks" element={
            <ProtectedRoute>
                <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/api" element={<ApiData />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;
