import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import Banner from '../components/Gallery/Banner'
import BookLibrary from '../components/Gallery/BookLibrary'
import Footer from '../components/Footer'

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <NavBar/>
      <Banner onSearch={handleSearch} />
      <div className='flex py-10 justify-center'>
        <h1 className='text-5xl font-inter font-bold' >GALLERY</h1>
      </div>
      <div className='py-10'>
        <BookLibrary searchTerm={searchTerm} />
      </div>
      <Footer/>
    </>
  )
}

export default Gallery