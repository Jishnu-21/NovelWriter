import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres, addGenre, updateGenre, toggleGenreStatus } from '../../features/admin/GenreSlice';
import ConfirmationDialog from '../ConfirmationDialog';
import EditGenreDialog from './EditGenreDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Genre = () => {
  const dispatch = useDispatch();
  const { genres, status, error } = useSelector((state) => state.genre);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

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
    setConfirmAction(() => () => dispatch(toggleGenreStatus(genre._id)));
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    confirmAction();
    setConfirmDialogOpen(false);
  };

  const handleSaveGenre = (genreData) => {
    if (selectedGenre) {
      dispatch(updateGenre({ id: selectedGenre._id, ...genreData }));
    } else {
      dispatch(addGenre(genreData));
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