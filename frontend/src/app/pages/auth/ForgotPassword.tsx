import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router';
import { db } from '../../db/database';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Check if user exists
      const user = await db.users.findByEmail(email);

      // Always show success message (don't reveal if user exists)
      setSuccess(true);
      setLoading(false);

      // In real app, send email with reset link
      // For now, just log the reset token
      if (user) {
        const resetToken = Math.random().toString(36).substring(2, 15);
        console.log('Password reset token for', email, ':', resetToken);

        // Create audit log
        await db.auditLogs.create({
          userId: user.id,
          action: 'FORGOT_PASSWORD',
          entityType: 'user',
          entityId: user.id,
          details: `Password reset requested for ${email}`,
          ipAddress: '127.0.0.1',
        });
      }

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Check your email!</p>
            <p className="text-sm mt-1">
              If an account exists with this email, you will receive a password reset link shortly.
            </p>
            <p className="text-sm mt-2 text-green-600">Redirecting to login...</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : success ? 'Email Sent!' : 'Send Reset Link'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link to="/login" className="block text-sm text-green-600 hover:text-green-500">
              Back to Sign In
            </Link>
            <Link to="/signup" className="block text-sm text-gray-600 hover:text-gray-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
