import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersThunk, toggleBlockUserThunk } from '../../features/admin/adminSlice';
import ConfirmationDialog from '../ConfirmationDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedUser) {
      dispatch(toggleBlockUserThunk(selectedUser._id));
    }
    setConfirmDialogOpen(false);
  };
  

  if (loading) {
    return <p className="text-white">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading users: {error}</p>;
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