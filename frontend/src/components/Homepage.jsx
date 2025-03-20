import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Contactus from './Contactus';
import Testimonial from './Testimonial';
import Main from './Main';

const Homepage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/Main");
  };

  const teamMembers = [
    {
      name: "Rahul Gawade",
      image: "src/assets/Rahul.jpg",
      role: "Final Year CSE Student",
      description: "Specialized in MERN stack, Ex-Intern Flare Global Soft, Nashik",
      linkedin: "https://www.linkedin.com",
      github: "https://www.github.com"
    },
    {
      name: "Vrushali More",
      image: "src/assets/Vrushali.jpg",
      role: "Final Year CSE Student",
      description: "Specialized in MERN stack,Intern at Zealits Solution Pvt.Ltd,Pune",
      linkedin: "https://www.linkedin.com",
      github: "https://www.github.com"
    },
    {
      name: "Vaishnavi Jadhav",
      image: "src/assets/Vaishnavi.jpg",
      role: "Final Year CSE Student",
      description: "Skilled in Datascience, AI/ML and a quick learner",
      linkedin: "https://www.linkedin.com",
      github: "https://www.github.com"
    },
    {
      name: "Sakshi Pawale",
      image: "src/assets/Sakshi.jpg",
      role: "Final Year CSE Student",
      description: "Specialized in Frontend development",
      linkedin: "https://www.linkedin.com",
      github: "https://www.github.com"
    }
  ];

  return (
    <div className="pt-20 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8">
        <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative group flex-shrink-0 w-full max-w-lg">
            <img
              src="src/assets/RVSVlogo.svg"
              className="w-full h-auto rounded-2xl  "
              alt="Responsive Logo"
            />

          </div>

          <div className="flex flex-col space-y-8 max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 leading-tight">
              Fabric Damage Detection and Material Identification
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our AI-powered solution processes image data to accurately identify materials and assess damage extent, enhancing the speed and precision of defect detection.
            </p>
            <button 
              onClick={handleGetStarted} 
              className="self-center lg:self-start group relative inline-flex items-center px-8 py-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transition-all duration-500 hover:shadow-purple-500/25"
            >
              <span className="relative flex items-center gap-2">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto p-8 backdrop-blur-lg bg-white/5 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-8">
            Rate Your Experience
          </h2>
          <div className="flex justify-center">
            <div className="rating gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-gradient-to-r from-orange-400 to-yellow-400 w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
                  defaultChecked={star === 2}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonial />

      {/* Team Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-16">
            Meet Our Expert Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm shadow-xl transition-all duration-500 hover:shadow-purple-500/20">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-6 overflow-hidden rounded-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-gray-400 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-300 text-center text-sm mb-6">{member.description}</p>
                  <div className="flex space-x-4">
                    <a 
                      href={member.linkedin}
                      className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors duration-300"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href={member.github}
                      className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors duration-300"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contactus />
    </div>
  );
};

export default Homepage;