import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "This is the best service I have ever used. Highly recommended!",
    author: "John Doe",
    role: "Software Engineer",
    rating: 5
  },
  {
    id: 2,
    text: "A fantastic experience from start to finish. The AI detection is incredibly accurate.",
    author: "Jane Smith",
    role: "Quality Analyst",
    rating: 5
  },
  {
    id: 3,
    text: "I am extremely satisfied with the results. Will definitely come back!",
    author: "Michael Johnson",
    role: "Production Manager",
    rating: 4
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            What Our Users Say
          </span>
        </h2>

        <div className="relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 grid grid-cols-2 -z-10">
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl aspect-square w-full"></div>
            <div className="bg-gradient-to-l from-pink-500/10 to-transparent rounded-full blur-3xl aspect-square w-full"></div>
          </div>

          <div className="relative backdrop-blur-sm bg-black/30 rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="min-h-[16rem] flex flex-col items-center justify-center">
              <div
                className={`text-center transition-all duration-500 ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed mb-8">
                  "{testimonials[currentIndex].text}"
                </p>
                
                {/* Rating Stars */}
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-6 h-6 ${
                        index < testimonials[currentIndex].rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {testimonials[currentIndex].author}
                  </h4>
                  <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                className="transform -translate-x-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="transform translate-x-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;