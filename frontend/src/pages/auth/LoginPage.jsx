import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      // Navigation is handled by App.jsx or we can redirect based on role, but AuthContext handles setting role and App.jsx redirect can be tricky here.
      // Actually we just navigate to / and the navigation bar will handle showing the correct dashboard link. Wait, we should navigate directly to the dashboard.
      // But we might need to wait for userRole to be fetched.
      // We'll let the user click the dashboard link or we can navigate to '/' and let the user click.
      // Better: we can navigate to dashboard but since login resolves before role is fetched, we just go to '/'
      navigate('/');
    } catch (error) {
      toast.error('Failed to log in: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm mt-1"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm mt-1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-black group-hover:text-black" aria-hidden="true" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
              Register here
            </Link>
          </p>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
           <p className="text-xs text-gray-500 text-center mb-2">Demo Accounts (Password: 123456)</p>
           <div className="flex flex-wrap justify-center gap-2">
             <button onClick={() => { setEmail('admin@aidsync.com'); setPassword('123456'); }} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Admin</button>
             <button onClick={() => { setEmail('volunteer@aidsync.com'); setPassword('123456'); }} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Volunteer</button>
             <button onClick={() => { setEmail('reporter@aidsync.com'); setPassword('123456'); }} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Reporter</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
