import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const banners = [
  {
    title: "Read Interactive Stories",
    subtitle: "Find everything you need in one place.",
    imageUrl: "/lord-of-the-rings-landscape-volcano-7786fkh0teid3wdb.jpg",
  },
  {
    title: "Explore New Worlds",
    subtitle: "Dive into immersive adventures.",
    imageUrl: "/1920x1080-scifi-city-concept-4k_1614623577.jpg",
  },
  {
    title: "Create Your Own Path",
    subtitle: "Shape the story with your choices.",
    imageUrl: "/1920x1080-t36-3840x2160_1712181524.jpg",
  },
];

const Banner = ({ onSearch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${banner.imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-5xl font-bold mb-4">{banner.title}</h2>
            <p className="text-2xl mb-6">{banner.subtitle}</p>
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-5 pr-12 rounded-full text-black"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="w-7 h-7 text-gray-500" />
              </button>
            </form>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? 'bg-white w-5 h-5' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
