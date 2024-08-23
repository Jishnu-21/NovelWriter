import React from 'react';
import { FaTimes } from 'react-icons/fa';

const UserListModal = ({ isOpen, onClose, users, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes />
          </button>
        </header>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="py-2 border-b">
              {user.username}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserListModal;
