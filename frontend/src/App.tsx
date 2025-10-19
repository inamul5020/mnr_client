import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClientIntakeForm } from './pages/ClientIntakeForm'
import { AdminDashboard } from './pages/AdminDashboard'
import { SuccessPage } from './pages/SuccessPage'
import { LoginForm } from './components/LoginForm'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { HealthCheck } from './components/HealthCheck'
import { LogOut, User, Users, Menu, X } from 'lucide-react'
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

// Header with logout functionality
const AuthenticatedHeader = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              MNR Associates - Client Intake System
            </h1>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Client Form
            </a>
            <a
              href="/admin"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <Users className="h-4 w-4 mr-1" />
              Dashboard
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.fullName} ({user?.role})</span>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Logout Button */}
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-200 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user?.fullName} ({user?.role})</span>
                </div>
              </div>
              <a
                href="/"
                className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Client Form
              </a>
              <a
                href="/admin"
                className="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 mr-2" />
                Dashboard
              </a>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <HealthCheck />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AuthenticatedHeader />
                <main>
                  <Routes>
                    <Route path="/" element={<ClientIntakeForm />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/success" element={<SuccessPage />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
