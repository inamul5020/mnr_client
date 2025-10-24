import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClientIntakeForm } from './pages/ClientIntakeForm'
import { Dashboard } from './pages/Dashboard'
import { ClientList } from './pages/ClientList'
import { SuccessPage } from './pages/SuccessPage'
import { DepartmentManagement } from './pages/DepartmentManagement'
import { RoleManagement } from './pages/RoleManagement'
import { StaffIntakeForm } from './pages/StaffIntakeForm'
import { StaffSuccessPage } from './pages/StaffSuccessPage'
import { LoginForm } from './components/LoginForm'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { HealthCheck } from './components/HealthCheck'
import { Sidebar } from './components/Sidebar'
import { HeaderWithSidebar } from './components/HeaderWithSidebar'
import { useState } from 'react'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

// Layout with sidebar
const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 lg:ml-64">
        <HeaderWithSidebar onMenuClick={toggleSidebar} />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<ClientIntakeForm />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/clients" element={<ClientList />} />
              <Route path="/admin/departments" element={<DepartmentManagement />} />
              <Route path="/admin/roles" element={<RoleManagement />} />
              <Route path="/staff/new" element={<StaffIntakeForm />} />
              <Route path="/staff/success" element={<StaffSuccessPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <HealthCheck />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
