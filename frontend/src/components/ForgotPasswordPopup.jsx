import React, { useState } from 'react';

const ForgotPasswordPopup = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(email);
      // If successful, the popup will be closed by the parent component
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-xl mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded-md text-sm"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button 
            type="submit" 
            className="w-full p-3 bg-black text-white rounded-md text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;