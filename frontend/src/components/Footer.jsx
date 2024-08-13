import React from 'react';
import '../../src/index.css';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-center md:space-x-8 mb-6">
          <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">About Us</a>
          <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">Our Work</a>
          <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">LinkedIn</a>
          <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">Contact Us</a>
        </div>
        <hr className="border-t border-gray-600 mb-6" />
        <div className="flex flex-col md:flex-row md:justify-between text-sm">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-300 mb-2 md:mb-0">Terms of Service</a>
          </div>
          <p className="text-gray-500 text-center md:text-left">&copy; 2024 NovelWriter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
