import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const SEND_MESSAGE = gql`
  mutation SendMessage($messages: [MessageInput!]!) {
    sendMessage(messages: $messages) {
      role
      content
    }
  }
`;

const CharacterButton = ({ character, onClick }) => (
  <Button
    variant="contained"
    onClick={onClick}
    sx={{
      mb: 1,
      width: '100%',
      bgcolor: 'primary.main',
      '&:hover': { bgcolor: 'primary.dark' },
      textOverflow: 'ellipsis',
    }}
  >
    {character.name || 'Unnamed Character'}
  </Button>
);

const CharacterDialog = ({ open, character, onClose, onUpdate, onDelete }) => (
  <Dialog open={open} onClose={onClose} PaperProps={{ sx: { padding: 2, borderRadius: 2 } }}>
    <DialogTitle>{character.name || 'Character Details'}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Name"
        type="text"
        fullWidth
        variant="outlined"
        value={character.name}
        onChange={(e) => onUpdate({ ...character, name: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Characteristics"
        type="text"
        fullWidth
        variant="outlined"
        multiline
        rows={3}
        value={character.characteristics}
        onChange={(e) => onUpdate({ ...character, characteristics: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onDelete} color="error">Delete</Button>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Adventure', 'Action'];
const imageStyles = ['Realism', 'Anime', 'Cartoon', 'Abstract', 'Watercolor'];

const AIWriting = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [outline, setOutline] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genre, setGenre] = useState(0);
  const [imageStyle, setImageStyle] = useState('');

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const addCharacter = () => {
    setCharacters([...characters, { name: '', characteristics: '' }]);
  };

  const updateCharacter = (index, updatedCharacter) => {
    const newCharacters = [...characters];
    newCharacters[index] = updatedCharacter;
    setCharacters(newCharacters);
  };

  const removeCharacter = (index) => {
    const newCharacters = characters.filter((_, i) => i !== index);
    setCharacters(newCharacters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    if (characters.length === 0) {
      setError('Please add at least one character.');
      setIsGenerating(false);
      return;
    }

    if (!imageStyle) {
      setError('Please select an image style.');
      setIsGenerating(false);
      return;
    }

    const messages = [
      { role: 'user', content: `Characters: ${JSON.stringify(characters)}` },
      { role: 'user', content: `Basic Outline: ${outline}` },
      { role: 'user', content: `Genre: ${genres[genre]}` },
      { role: 'user', content: 'Generate the first part of the story. Keep it brief and end with a cliffhanger or a point where the user can make a decision.' },
    ];

    try {
      const { data } = await sendMessage({ variables: { messages } });
      navigate('/story-reader', { 
        state: { 
          initialContent: data.sendMessage.content, 
          characters, 
          outline, 
          genre: genres[genre],
          imageStyle 
        } 
      });
    } catch (error) {
      console.error('Error generating story:', error);
      setError('An error occurred while generating the story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, mb: 4, mt: 4 }}>
        <Typography variant={isSmallScreen ? "h5" : "h4"} component="h1" gutterBottom>
          Interactive AI Story Generator
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant={isSmallScreen ? "h6" : "h5"} component="h2" gutterBottom>
              Genre
            </Typography>
            <Tabs
              value={genre}
              onChange={(e, newValue) => setGenre(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {genres.map((g, index) => (
                <Tab key={index} label={g} />
              ))}
            </Tabs>

            <Typography variant={isSmallScreen ? "h6" : "h5"} component="h2" gutterBottom>
              Image Style
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="image-style-label">Select Image Style</InputLabel>
              <Select
                labelId="image-style-label"
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                label="Select Image Style"
              >
                {imageStyles.map((style) => (
                  <MenuItem key={style} value={style}>{style}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant={isSmallScreen ? "h6" : "h5"} component="h2" gutterBottom>
              Characters
            </Typography>
            <Grid container spacing={isSmallScreen ? 1 : 2}>
              {characters.map((character, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CharacterButton
                    character={character}
                    onClick={() => setSelectedCharacter(index)}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addCharacter}
                sx={{
                  width: isSmallScreen || isMediumScreen ? '100%' : 'auto',
                }}
              >
                Add Character
              </Button>
            </Box>

            <Typography variant={isSmallScreen ? "h6" : "h5"} component="h2" gutterBottom sx={{ mt: 4 }}>
              Basic Outline
            </Typography>
            <TextField
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="Enter the basic outline of your story"
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isGenerating}
              sx={{ position: 'relative', width: isSmallScreen || isMediumScreen ? '100%' : 'auto' }}
            >
              {isGenerating ? <CircularProgress size={24} sx={{ position: 'absolute' }} /> : 'Start Story'}
            </Button>
          </form>
        </Paper>

        {selectedCharacter !== null && (
          <CharacterDialog
            open={selectedCharacter !== null}
            character={characters[selectedCharacter]}
            onClose={() => setSelectedCharacter(null)}
            onUpdate={(updatedCharacter) => updateCharacter(selectedCharacter, updatedCharacter)}
            onDelete={() => {
              removeCharacter(selectedCharacter);
              setSelectedCharacter(null);
            }}
          />
        )}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
          sx={{ backgroundColor: 'error.main' }}
        />
      </Container>
      <Footer />
    </Box>
  );
};

export default AIWriting;
