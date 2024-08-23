import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { googleSignIn } from '../features/auth/authSlice'; // Adjust import path

const InputField = ({ type, placeholder, value, onChange, showPassword, togglePassword }) => (
  <div className="relative">
    <input
      type={type === 'password' && showPassword ? 'text' : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm pr-10"
    />
    {type === 'password' && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    )}
  </div>
);

const Button = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full p-3 bg-black text-white rounded-md text-sm font-semibold"
  >
    {children}
  </button>
);

const SocialButton = ({ Icon, onClick }) => (
  <button onClick={onClick} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
    <Icon size={24} />
  </button>
);

const AuthForm = ({ title, fields, buttonText, additionalContent, onSubmit, error }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = () => {
    dispatch(googleSignIn());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen bg-white">
      <div 
        className="w-1/2 bg-cover bg-center bg-blend-multiply bg-custom-pink"
        style={{ 
          backgroundImage: `url('/Benefits Image  --dalle.png')`,
          backgroundColor: 'rgba(255, 192, 203, 0.6)',
        }}
      />
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-2/3 max-w-md">
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <InputField
                key={index}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                showPassword={field.type === 'password' && showPassword}
                togglePassword={togglePassword}
              />
            ))}
            {additionalContent}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit">{buttonText}</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-4">Or sign {title.toLowerCase() === 'login' ? 'in' : 'up'} with</p>
            <div className="flex justify-center space-x-4">
              <SocialButton Icon={FcGoogle} onClick={handleGoogleSignIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;