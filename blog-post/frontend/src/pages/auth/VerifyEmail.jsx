// src/pages/auth/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      AuthService.verifyEmail(token)
        .then(response => {
          if (response.token) {
            signIn(response);
            setMessage('Email verified successfully! Redirecting...');
            setTimeout(() => navigate('/'), 2000);
          } else {
            setError(response.error || 'Failed to verify email.');
          }
        })
        .catch(err => {
          setError(err.message || 'An error occurred during verification.');
        });
    } else {
      setError('No verification token found.');
    }
  }, [location, navigate, signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;