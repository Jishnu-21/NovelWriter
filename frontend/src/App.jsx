import React, { useEffect } from 'react';
import Homepage from './Pages/Homepage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AuthCallback from './components/AuthCallback';
import Gallery from './Pages/Gallery';
import ResetPassword from './Pages/ResetPassword';
import AdminLogin from './Pages/Admin/Login';
import AdminDashboard from './Pages/Admin/Dashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import WritingPage from './Pages/WritingPage';
import StartWriting from './Pages/Story/StartWriting';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import UnpublishedStories from './Pages/Story/UnpublishedStories';
import { loadStoryFromLocalStorage } from './features/story/storySlice';
import { useDispatch } from 'react-redux';
import BookDetailPage from './Pages/BookDetailPage';
import BookReader from './Pages/BookReader';
import Profile from './Pages/Profile';
import ContactUs from './Pages/contactUs';
import AboutUs from './Pages/AboutUs';
import AuthorProfile from './AuthorProfile';
import NotificationPage from './Pages/NotificationPage';
import AIwrting from './Pages/AI/AIwrting';
import StoryReader from './Pages/AI/StoryReader';
import LikedBooks from './components/Profile/LikedBooks';
import History from './components/Profile/History';
import {NotificationProvider} from './context/NotificationContext'
import NotificationList from './components/NotificationList';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadStoryFromLocalStorage());
  }, [dispatch]);

  return (
    <NotificationProvider>
    <NotificationList />
    <Router>
      <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route 
          path="/writing" 
          element={<ProtectedUserRoute element={<WritingPage />} />} 
        />
        <Route 
          path="/story-writing/:storyId" 
          element={<ProtectedUserRoute element={<StartWriting />} />} 
        />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/story-reader" element={<StoryReader />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} isAdmin />}
        />
       <Route path="/unpublished-stories" 
          element={<ProtectedUserRoute element={<UnpublishedStories />} />} 
          />
       <Route path="/story/:id" element={<BookDetailPage />} />
       <Route path="/read/:id" element={<BookReader/>} />
       <Route path="/ai" element={<AIwrting/>} />
       <Route path="/profile"
          element={<ProtectedUserRoute element={<Profile />} />} 
          />
       <Route path="/favorites"
          element={<ProtectedUserRoute element={<LikedBooks />} />} 
          />
       <Route path="/history"
          element={<ProtectedUserRoute element={<History />} />} 
          />
       <Route path="/author/:userId" element={<AuthorProfile />} />
       <Route path="/notifications" element={<NotificationPage />} />
</Routes>
</AuthProvider>
</ThemeProvider>
    </Router>
    </NotificationProvider>

  );
}

export default App
