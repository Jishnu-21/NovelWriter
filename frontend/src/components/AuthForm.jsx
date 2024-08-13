import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { googleSignIn } from '../features/auth/authSlice'; // Adjust import path

const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm"
  />
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

  const handleGoogleSignIn = () => {
    dispatch(googleSignIn());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
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