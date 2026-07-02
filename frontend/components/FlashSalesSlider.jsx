"use client";

import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FlashSalesSlider({ products }) {
  const scrollContainerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate target date (closest future flash sale end date)
  useEffect(() => {
    if (!products || products.length === 0) return;

    let closestEndDate = null;
    const now = new Date().getTime();

    products.forEach(p => {
      if (p.flashSaleEndDate) {
        const endDate = new Date(p.flashSaleEndDate).getTime();
        if (endDate > now) {
          if (!closestEndDate || endDate < closestEndDate) {
            closestEndDate = endDate;
          }
        }
      }
    });

    if (!closestEndDate) {
      // If no valid end dates, use a dummy target: 6 days, 23 hours, 19 mins, 56 secs from now
      closestEndDate = now + (6 * 24 * 60 * 60 * 1000) + (23 * 60 * 60 * 1000) + (19 * 60 * 1000) + (56 * 1000);
    }

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = closestEndDate - currentTime;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // Run once immediately to avoid 1s delay
    const currentTime = new Date().getTime();
    const distance = closestEndDate - currentTime;
    if (distance >= 0) {
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }

    return () => clearInterval(timer);
  }, [products]);

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

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <>
      {/* Header and Countdown */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Flash Sales</h2>
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 sm:gap-4 text-black">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1">Days</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest">{formatNumber(timeLeft.days)}</span>
            </div>
            <span className="text-[#DB4444] text-2xl sm:text-3xl font-bold mt-4 sm:mt-4">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1">Hours</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest">{formatNumber(timeLeft.hours)}</span>
            </div>
            <span className="text-[#DB4444] text-2xl sm:text-3xl font-bold mt-4 sm:mt-4">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1">Minutes</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest">{formatNumber(timeLeft.minutes)}</span>
            </div>
            <span className="text-[#DB4444] text-2xl sm:text-3xl font-bold mt-4 sm:mt-4">:</span>
            
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium mb-1">Seconds</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-widest">{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
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

      {/* Products Slider */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="w-[280px] sm:w-[300px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 w-full text-left">No flash sale products available right now.</p>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </>
  );
}
