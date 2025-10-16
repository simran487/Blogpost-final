// src/pages/auth/VerifyOtp.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react'; // Import the ArrowLeft icon

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // 💡 Add loading state
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth(); // 💡 Get setToken and setUser from context
  const { userId, email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 💡 Set loading
    setError('');
    setMessage('');

    if (!userId) {
      setError('Something went wrong. Please try signing up again.');
      return;
    }

    try {
      const response = await AuthService.verifyOtp(userId, otp);
      if (response.token) {
        // 💡 Directly set the authentication state
        setToken(response.token);
        setUser(response.user);
        setMessage('Email verified successfully! Redirecting to your dashboard...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.error || 'Failed to verify OTP.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during OTP verification.');
    } finally {
      setLoading(false); // 💡 Unset loading
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');

    // 💡 NEW: Add a check for email before resending
    if (!email) {
      setError('Something went wrong. Please try signing up again.');
      return;
    }

    try {
      const response = await AuthService.resendOtp(email);
      if (response.message) {
        setMessage(response.message);
      } else {
        setError(response.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while resending OTP.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page 
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">

         {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 text-center">Enter OTP</h2>
        <p className="text-gray-600 text-center mb-8">
          An OTP has been sent to <strong>{email}</strong>. Please enter it below to verify your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              One-Time Password
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading} // 💡 Disable button when loading
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div className="mt-6 text-right">
          <button onClick={handleBack} className="text-sm text-gray-600 hover:underline">
            Back
          </button>
          </div>
          <div className="mt-2 text-center">
          <button onClick={handleResendOtp} className="text-sm text-indigo-600 hover:underline">
            Resend OTP
          </button>
        </div>
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;