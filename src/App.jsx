import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import Login from './pages/Login'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import UpcomingPage from './pages/UpcomingPage'
import FinishedPage from './pages/FinishedPage'
import MissedPage from './pages/MissedPage'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import FocusMode from './pages/FocusMode'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TaskProvider>
          <BrowserRouter>
            <ToastContainer />
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
            <Route path="finished" element={<FinishedPage />} />
            <Route path="missed" element={<MissedPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* Focus Mode (full screen, outside Layout) */}
            <Route path="/focus" element={
              <ProtectedRoute>
                <FocusMode />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
