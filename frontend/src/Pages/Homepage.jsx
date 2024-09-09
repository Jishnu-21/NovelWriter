import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import InfoFP from '../components/InfoFP'
import Footer from '../components/Footer'
import './dark_mode.css' // Add dark mode CSS file

const Homepage = () => {
  return (
    <div className="dark-mode"> // Add dark-mode class to the container
      <NavBar/>
      <Header/>
      <InfoFP/>
      <Footer/>
    </div>
  )
}

export default Homepage
