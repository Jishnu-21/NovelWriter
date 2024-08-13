import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../components/AuthForm';
import { signup, verifyOTP, resendOTP, reset } from '../features/auth/authSlice';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, otpSent, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Password strength criteria: at least 8 characters, one uppercase, one lowercase, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    dispatch(signup({ username, email, password }));
  };

  const handleOTPVerification = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email, otp }));
  };

  const handleResendOTP = () => {
    dispatch(resendOTP({ email }));
    setTimer(120); // Reset timer to 2 minutes
  };

  const handleGoBack = () => {
    dispatch(reset());
    setTimer(120);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Prepare error message
  const errorMessage = error ? (typeof error === 'string' ? error : error.message) : '';

  if (otpSent) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6 text-center">Verify Your Email</h2>
          <p className="text-gray-600 mb-6 text-center">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </p>
          <form onSubmit={handleOTPVerification}>
            <input
              type="text"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <p className="text-center mb-4">Send OTP Again in: {formatTime(timer)}</p>
            <button
              type="submit"
              className="w-full p-3 bg-black text-white rounded-md text-sm font-semibold mb-2"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold mb-2"
              disabled={timer > 0}
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold"
            >
              Go Back
            </button>
          </form>
          {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthForm
        title="Sign up"
        fields={[
          { type: "text", placeholder: "Name", value: username, onChange: (e) => setUsername(e.target.value) },
          { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) },
          { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) },
          { type: "password", placeholder: "Confirm password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }
        ]}
        buttonText={isLoading ? "Sending OTP..." : "Sign up"}
        onSubmit={handleSubmit}
        error={errorMessage || passwordError}
      />
      <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
      
    </> 
    
  );
};

export default Signup;
