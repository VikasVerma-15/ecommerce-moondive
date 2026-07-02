"use client";

import Link from 'next/link';
import { Smartphone, Monitor, Watch, Camera, Headphones, Gamepad } from 'lucide-react';

export default function CategoryBrowse() {
  const categories = [
    { name: 'Phones', icon: Smartphone, slug: 'phones' },
    { name: 'Computers', icon: Monitor, slug: 'computers' },
    { name: 'SmartWatch', icon: Watch, slug: 'smartwatch' },
    { name: 'Camera', icon: Camera, slug: 'camera' },
    { name: 'HeadPhones', icon: Headphones, slug: 'headphones' },
    { name: 'Gaming', icon: Gamepad, slug: 'gaming' },
  ];

  return (
    <div className="section-width px-4 xl:px-0 py-10 mt-10 border-b border-gray-200 ">
      {/* Section Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
        <span className="text-[#DB4444] font-bold text-base">Categories</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Browse By Category</h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-4">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <Link 
              key={idx} 
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center justify-center h-[145px] border border-gray-300 rounded-[4px] cursor-pointer hover:bg-[#DB4444] hover:border-[#DB4444] transition-all duration-300"
            >
              <Icon 
                size={40} 
                className="text-black group-hover:text-white mb-4 stroke-1 transition-colors duration-300" 
              />
              <span className="text-black group-hover:text-white font-medium transition-colors duration-300 text-sm sm:text-base">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
