// src/pages/auth/SignIn.jsx
import React, { useState, useEffect } from 'react'; // 💡 Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react'; // Import Close icon

const SignIn = () => {
  const navigate = useNavigate();
  // 💡 Retrieve isAuthenticated state
  const { signIn, authLoading, isAuthenticated } = useAuth(); 
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 💡 NEW: Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
        navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await signIn(formData);

    if (result.success) {
      // Redirection is also handled by the useEffect above, but keep for immediate feedback
      navigate('/'); 
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    navigate('/'); // Navigate back to the read-only home page
  }

  // 💡 Render nothing while redirecting
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Sign in to your account
          </h2>
          
          {/* Error Message */
          error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={authLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={authLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                      authLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <div className="p-8 pt-0 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
