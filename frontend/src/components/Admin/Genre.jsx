import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationDialog from '../ConfirmationDialog';
import EditGenreDialog from './EditGenreDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { API_URL } from '../../config';

const API_URL2 = `${API_URL}/admin/genres`; // Replace with your actual API URL

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setStatus('loading');
      try {
        const response = await axios.get(API_URL2);
        setGenres(response.data);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    };

    fetchGenres();
  }, []);

  const handleAddGenre = () => {
    setSelectedGenre(null);
    setEditDialogOpen(true);
  };

  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    setEditDialogOpen(true);
  };

  const handleToggleGenreStatus = (genre) => {
    setSelectedGenre(genre);
    setConfirmAction(() => () => toggleGenreStatus(genre._id));
    setConfirmDialogOpen(true);
  };

  const toggleGenreStatus = async (id) => {
    try {
      await axios.patch(`${API_URL2}/${id}/toggle`);
      fetchGenres(); // Refetch genres after status change
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmAction = () => {
    confirmAction();
    setConfirmDialogOpen(false);
  };

  const handleSaveGenre = async (genreData) => {
    try {
      if (selectedGenre) {
        await axios.put(`${API_URL2}/${selectedGenre._id}`, genreData);
      } else {
        await axios.post(API_URL2, genreData);
      }
      fetchGenres(); // Refetch genres after saving
    } catch (err) {
      setError(err.message);
    }
    setEditDialogOpen(false);
  };

  if (status === 'loading') {
    return <p className="text-white">Loading genres...</p>;
  }

  if (status === 'failed') {
    return <p className="text-red-500">Error loading genres: {error}</p>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Genres</h2>
        <Button variant="contained" color="primary" onClick={handleAddGenre}>
          Add New Genre
        </Button>
      </div>
      <TableContainer component={Paper} className="bg-gray-900">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-gray-300">Name</TableCell>
              <TableCell className="text-gray-300">Description</TableCell>
              <TableCell className="text-gray-300">Status</TableCell>
              <TableCell className="text-gray-300">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre._id}>
                <TableCell className="text-gray-200">{genre.name}</TableCell>
                <TableCell className="text-gray-200">{genre.description}</TableCell>
                <TableCell className="text-gray-200">{genre.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditGenre(genre)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleToggleGenreStatus(genre)} color={genre.isActive ? 'secondary' : 'primary'}>
                    {genre.isActive ? 'Deactivate' : 'Activate'}
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
        message={`Are you sure you want to ${selectedGenre?.isActive ? 'deactivate' : 'activate'} this genre?`}
      />

      <EditGenreDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        handleSave={handleSaveGenre}
        genre={selectedGenre}
      />
    </div>
  );
};

export default Genre;
