import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../components/AuthForm';
import ForgotPasswordPopup from '../components/ForgotPasswordPopup';
import { forgotPassword, login, reset } from '../features/auth/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [loginError, setLoginError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

 useEffect(() => {
    if (error) {
      setLoginError(error);
      if (error.includes('account')) {
        alert('Your account has been blocked. Please contact support for assistance.');
      }
    }
  }, [error]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please fill in all fields');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      setLoginError(typeof err === 'string' ? err : err.message || 'Login failed. Please check your credentials.');
    }
  };
  
  const handleForgotPasswordSubmit = async (email) => {
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setShowForgotPasswordPopup(false);
      alert('Password reset link sent to your email');
    } catch (err) {
      throw new Error(err || 'Failed to send reset link');
    }
  };
  
  return (
    <>
      <AuthForm
        title="Login"
        fields={[
          { type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value) },
          { type: 'password', placeholder: 'Password', value: password, onChange: (e) => setPassword(e.target.value) }
        ]}
        buttonText={isLoading ? 'Loading...' : 'Login'}
        onSubmit={handleSubmit}
        additionalContent={
          <>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPasswordPopup(true)}
                className="text-xs text-blue-500 hover:underline"
              >
                Forgot password
              </button>
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          </>
        }
      />

      {showForgotPasswordPopup && (
        <ForgotPasswordPopup
          onClose={() => setShowForgotPasswordPopup(false)}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}

      <div className="absolute bottom-4 right-4 text-sm text-gray-600 text-center w-full md:w-auto">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
