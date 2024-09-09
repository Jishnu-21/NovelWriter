import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import InfoFP from '../components/InfoFP'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <div className="bg-gray-900 text-white"> // Replace with Tailwind CSS classes
      <NavBar/>
      <Header/>
      <InfoFP/>
      <Footer/>
    </div>
  )
}

export default Homepage
