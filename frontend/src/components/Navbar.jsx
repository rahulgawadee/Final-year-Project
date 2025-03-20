import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Moved to the left */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="src/assets/RVSVlogo.svg"
                  alt="Logo"
                  className="h-12 w-auto transition-transform hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
              <div className="flex space-x-8">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/Contactus" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
                <Link to="/Aboutus" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium">
                  About
                </Link>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <Link to="/Login" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-105">
                <User className="w-6 h-6 text-white" />
              </Link>
              
              {/* Mobile Menu Button - Moved to right */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-black/90 backdrop-blur-md`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="#team" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Team
            </Link>
            <Link to="#how-to-use" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              How to use?
            </Link>
            <Link to="/Contactus" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            <Link to="/Aboutus" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Border Gradient */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default Navbar;