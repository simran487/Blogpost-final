// src/pages/auth/SignUp.jsx
import React, { useState, useEffect } from 'react'; // 💡 Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react'; // Import Close icon

const SignUp = () => {
  const navigate = useNavigate();
  // 💡 Retrieve isAuthenticated state
  const { signUp, authLoading, isAuthenticated } = useAuth();
  
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

    // if (formData.password !== formData.confirmPassword) {
    //   setError('Passwords do not match!');
    //   return;
    // }

    // Prepare data for the API (only name, email, password)
    const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
    };
    
   try{
    const result = await signUp(registrationData);
   // console.log('Sign Up Result:', result); // Debugging line
    // Check for both success and the user object in the result
    if (result.success && result.user) {
       navigate('/verify-otp', { state: { userId: result.user.id, email: result.user.email } });
     } 
    }catch (error) {
        if (error.message && error.message.includes('This email is already registered')) {
        setError('This email is already registered. Please use a different email or sign in.');
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
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
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          // aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        {successMessage ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700">{successMessage}</p>
            <div className="mt-6">
              <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                Proceed to Sign In
              </Link>
            </div>
          </div>
        ) : (
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Create a New Account
          </h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={authLoading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              />
            </div>
            
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
                autoComplete="new-password"
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
                {authLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
        )}
        {/* Footer Link */}
        <div className="p-8 pt-0 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
