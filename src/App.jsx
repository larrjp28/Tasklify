import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import UpcomingPage from './pages/UpcomingPage'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes with Sidebar Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="upcoming" element={<UpcomingPage />} />
          <Route path="finished" element={<UpcomingPage />} />
          <Route path="missed" element={<UpcomingPage />} />
          <Route path="calendar" element={<UpcomingPage />} />
          <Route path="profile" element={<UpcomingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
