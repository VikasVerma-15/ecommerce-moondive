"use client";

import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HeroSection() {
  const categories = [
    { name: "Woman's Fashion", slug: "women-fashion", hasSub: false },
    { name: "Men's Fashion", slug: "men-fashion", hasSub: false },
    { name: "Electronics", slug: "electronic", hasSub: false },
    { name: "Smartwatch", slug: "smartwatch", hasSub: false },
    { name: "Camera", slug: "camera", hasSub: false },
    { name: "Headphones", slug: "headphones", hasSub: false },
    { name: "Phones", slug: "phones", hasSub: false },
    { name: "Groceries & Pets", slug: "food", hasSub: false },
    { name: "Health & Beauty", slug: "beauty-personal-care", hasSub: false },
  ];

  const slides = [
    { id: 1, title: "Up to 10%\noff Voucher" },
    { id: 2, title: "Up to 10%\noff Voucher" },
    { id: 3, title: "Up to 10%\noff Voucher" },
    { id: 4, title: "Up to 10%\noff Voucher" },
    { id: 5, title: "Up to 10%\noff Voucher" },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="section-width px-4 xl:px-0 flex flex-col lg:flex-row gap-5 mb-4 mt-2">
      {/* Sidebar Categories */}
      <div className="w-full lg:w-1/4 lg:border-r border-gray-200 pt-6 lg:pr-6 hidden sm:flex flex-col gap-4">
        {categories.map((category, index) => {
          const slug = category.slug;
          return (
            <Link href={`/products?category=${slug}`} key={index} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-md hover:bg-gray-50 transition-all duration-300">
              <span className="text-gray-900 font-medium group-hover:text-[#DB4444] group-hover:translate-x-1 transition-all duration-300">
                {category.name}
              </span>
              {category.hasSub && (
                <ChevronRight size={20} className="text-gray-900 group-hover:text-[#DB4444] group-hover:translate-x-1 transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Hero Slider Area */}
      <div className="w-full lg:w-3/4 pt-6">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl w-full h-[350px] sm:h-[400px] lg:h-[400px] relative overflow-hidden flex flex-col md:flex-row border border-gray-800">
          
          <div 
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div key={slide.id} className="w-full h-full flex flex-col md:flex-row shrink-0 relative">
                {/* Text Content */}
                <div className="flex flex-col justify-center px-10 md:px-16 z-10 pt-10 md:pt-0 w-full md:w-1/2">
                  <div className="flex items-center gap-4 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <svg viewBox="0 0 384 512" className="w-8 h-8 md:w-10 md:h-10 text-white fill-current">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.6 1.5 310 13.5 385 41.6 426.6c18.3 27.2 40.5 55 71.5 54.3 29.5-.7 40.9-19 75.9-19 35 0 44.9 19.1 76.4 18.9 32.5-.2 50.8-24.8 69.1-52.6 22.8-34.8 32-69.5 32.5-71.3-.6-.3-48.1-18.2-48.3-88.2zM241.4 83.6c14.6-18 24.5-43 21.9-67.6-21.7 1-47.3 15-62.5 32.8-13.4 15.6-24.6 41.2-21.4 65.3 24.2 1.9 47.4-12.7 62-30.5z" />
                    </svg>
                    <span className="text-white text-base md:text-lg font-medium tracking-wide">
                      iPhone 15 Series
                    </span>
                  </div>
                  
                  <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 whitespace-pre-line animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {slide.title}
                  </h1>
                  
                  <Link 
                    href="/products?category=phones&search=iphone%2015" 
                    className="flex items-center gap-2 text-white font-medium hover:text-[#DB4444] transition-all duration-300 border-b border-transparent hover:border-[#DB4444] w-max pb-1 group/btn animate-fade-in-up" style={{ animationDelay: '0.3s' }}
                  >
                    Shop Now <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
                {/* Image Content */}
                <div className="absolute right-0 bottom-0 md:static w-full md:w-1/2 flex items-end justify-end h-full">
                  <img 
                    src="/images/hero_endframe__cvklg0xk3w6e_large 2 (1).png" 
                    alt="iPhone 15 Series" 
                    className="object-contain max-h-[90%] lg:max-h-[100%] w-auto self-end opacity-70 md:opacity-100 mt-10 md:mt-0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${activeSlide === idx ? 'bg-[#DB4444] ring-2 ring-white' : 'bg-gray-500 hover:bg-gray-400'}`}
              ></div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
