import React from 'react';
import { Twitter, Youtube, Facebook, Instagram, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      {/* Background Blur Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Company Info */}
          <div className="space-y-6">
            <img
              src="src/assets/RVSVlogo.svg"
              className="h-16 w-auto transition-transform duration-300 hover:scale-105"
              alt="RVSV Logo"
            />
            <p className="text-gray-400 text-sm">
              Revolutionizing fabric analysis with cutting-edge AI technology. Your trusted partner in quality control and material identification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  Services
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  Careers
                </a>
              </li>
              <li>
                <a href="/press" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>contact@rvsv.tech</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Connect With Us</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </div>
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <Github className="w-5 h-5" />
                </div>
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </div>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} RVSV Tech Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;