
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EventDetail from './pages/EventDetail';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import EventCreateForm from "./components/EventCreateForm";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={<EventCreateForm />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="User"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><Admin /></ProtectedRoute>} />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="Admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  );
}
export default App;
