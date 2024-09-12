import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import InfoFP from '../components/InfoFP';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext

const Homepage = () => {
  const { darkMode } = useTheme(); // Access darkMode from the context

  return (
    <div>
      <NavBar />
      <Header/> 
      <InfoFP darkMode={darkMode} /> {/* Pass darkMode as a prop */}
      <Footer />
    </div>
  );
};

export default Homepage;
