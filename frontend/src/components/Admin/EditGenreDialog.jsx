import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../features/admin/GenreSlice';

const EditGenreDialog = ({ open, handleClose, handleSave, genre }) => {
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.genre);

  const [name, setName] = useState(genre ? genre.name : '');
  const [description, setDescription] = useState(genre ? genre.description : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(genre ? genre.name : '');
      setDescription(genre ? genre.description : '');
      setError('');
    }
  }, [open, genre]);

  const handleSaveClick = () => {
    if (!name.trim() || !description.trim()) {
      setError('All fields are required and cannot be empty.');
      return;
    }

    // Check for duplicate names
    const isDuplicate = genres.some(
      (g) => g.name.trim().toLowerCase() === name.trim().toLowerCase() && g._id !== genre?._id
    );
    if (isDuplicate) {
      setError('A genre with this name already exists.');
      return;
    }

    setError('');
    handleSave({ name, description });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{genre ? 'Edit Genre' : 'Add Genre'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText={error && !name.trim() ? 'Name cannot be empty.' : ''}
          error={!!error && !name.trim()}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText={error && !description.trim() ? 'Description cannot be empty.' : ''}
          error={!!error && !description.trim()}
        />
        {error && <p className="text-red-500">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          {genre ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGenreDialog;
