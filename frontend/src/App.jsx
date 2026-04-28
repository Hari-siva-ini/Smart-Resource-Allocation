import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Heart, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ReporterDashboard from './pages/reporter/ReporterDashboard';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'volunteer') return '/volunteer-dashboard';
    if (userRole === 'reporter') return '/reporter-dashboard';
    return '/';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Aram Seivom</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-brand-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors shadow-sm hover:shadow-md">Register</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {!currentUser ? (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-brand-600 hover:text-brand-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Toaster position="top-right" />
        <Navigation />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/volunteer-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reporter-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['reporter']}>
                  <ReporterDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-4">
               <Heart className="h-5 w-5 text-brand-500" />
               <span className="text-xl font-bold text-white tracking-tight">Aram Seivom</span>
            </div>
            <p>© {new Date().getFullYear()} Aram Seivom Platform. AI-Powered Volunteer Coordination.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
