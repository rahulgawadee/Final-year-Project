import React, { useState } from 'react';
import { Mail, Send, Phone, MapPin, MessageSquare } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="mt-10 relative min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
              Get in Touch
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions about our AI-powered fabric analysis? We're here to help you get the answers you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8 p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-gray-300 font-medium">Email</h3>
                  <p className="text-purple-400">support@fabricai.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-gray-300 font-medium">Phone</h3>
                  <p className="text-blue-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-gray-300 font-medium">Location</h3>
                  <p className="text-indigo-400">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form 
            onSubmit={handleSubmit}
            className="space-y-6 p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Send Message</span>
              <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;