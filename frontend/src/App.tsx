import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><Admin /></ProtectedRoute>} />
        {/* Add more routes as you build more pages */}
      </Routes>
    </Router>
  );
}
export default App;
