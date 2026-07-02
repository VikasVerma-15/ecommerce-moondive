"use client";

import { useRef } from 'react';
import ProductCard from './ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ExploreProductsSlider({ products }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header and Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 md:gap-0">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Explore Our Products</h2>
        
        <div className="flex gap-2">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} className="text-black" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowRight size={24} className="text-black" />
          </button>
        </div>
      </div>

      {/* Products Grid (2 Rows, Horizontal Scroll) */}
      <div 
        ref={scrollContainerRef}
        className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="w-[280px] sm:w-[300px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 w-full text-left col-span-full">No products available right now.</p>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <Link href="/products" className="bg-[#DB4444] text-white px-12 py-4 rounded-[4px] font-medium hover:bg-red-600 transition-colors">
          View All Products
        </Link>
      </div>
    </>
  );
}
