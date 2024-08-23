// components/Admin/Users.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationDialog from '../ConfirmationDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { API_URL } from '../../config';

const API_URL2 = `${API_URL}/admin`; // Replace with your API URL

const Users = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL2}/users`);
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Set users if response is an array
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Error loading users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedUser) {
      try {
        const response = await axios.patch(`${API_URL2}/users/${selectedUser._id}/block`);
        console.log(response.data); 
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? { ...user, isBlocked: !user.isBlocked }
              : user
          )
        );
      } catch (error) {
        console.error('Error updating user status:', error);
        setError('Error updating user status');
      }
    }
    setConfirmDialogOpen(false);
  };
  
  if (loading) {
    return <p className="text-white">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <TableContainer component={Paper} className="bg-gray-900">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-gray-300">Username</TableCell>
              <TableCell className="text-gray-300">Email</TableCell>
              <TableCell className="text-gray-300">Status</TableCell>
              <TableCell className="text-gray-300">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="text-gray-200">{user.username}</TableCell>
                <TableCell className="text-gray-200">{user.email}</TableCell>
                <TableCell className="text-gray-200">{user.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleToggleUserStatus(user)}
                    color={user.isBlocked ? 'primary' : 'secondary'}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmAction}
        message={`Are you sure you want to ${selectedUser?.isBlocked ? 'unblock' : 'block'} this user?`}
      />
    </div>
  );
};

export default Users;
