"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, ShoppingBag, XCircle, Star, LogOut } from 'lucide-react';
import api from '@/lib/api';
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart');
      const items = response.data.data?.items || [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get('/wishlist');
      const items = response.data.data?.products || [];
      setWishlistCount(items.length);
    } catch (err) {
      console.error("Failed to fetch wishlist count", err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoggedIn(true);
        fetchCartCount();
        fetchWishlistCount();
      }

      const handleCartUpdate = () => {
        fetchCartCount();
      };
      
      const handleWishlistUpdate = () => {
        fetchWishlistCount();
      };

      window.addEventListener('cartUpdated', handleCartUpdate);
      window.addEventListener('wishlistUpdated', handleWishlistUpdate);
      
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
        window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);



  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      
      // Sign out of NextAuth to prevent auto-relogin
      await signOut({ redirect: false });

      toast.success("Logged out successfully!");
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const getLinkClasses = (path) => {
    return `font-medium hover:text-gray-600 transition-colors ${
      pathname === path 
        ? 'text-gray-900 underline underline-offset-4 decoration-2' 
        : 'text-gray-900'
    }`;
  };

  return (
    <div className="w-full border-b border-gray-200 mt-[10px] lg:mt-[20px] relative z-50">
      <div className="section-width px-4 xl:px-0 mb-[16px]">
        <div className="flex items-center justify-between h-[38px] lg:gap-[148px]">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Exclusive
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-12">
            <Link href="/" className={getLinkClasses("/")}>
              Home
            </Link>
            <Link href="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>
            <Link href="/about" className={getLinkClasses("/about")}>
              About
            </Link>
            <Link href="/signup" className={getLinkClasses("/signup")}>
              Sign Up
            </Link>
          </div>

          {/* Right Section: Search & Icons */}
          <div className="flex items-center space-x-2 md:space-x-6 ml-auto">
            
            {/* Search Box */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-48 lg:w-64 bg-[#f5f5f5] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 relative">
              <Link href="/wishlist" className="text-gray-900 hover:text-gray-600 relative flex items-center justify-center h-8 w-8">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#DB4444] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="text-gray-900 hover:text-gray-600 relative flex items-center justify-center h-8 w-8">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#DB4444] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer transition-colors ${dropdownOpen ? 'bg-[#db4444] text-white' : 'text-gray-900 hover:text-gray-600'}`}
                  >
                    <User className="h-6 w-6" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-[4px] shadow-2xl overflow-hidden backdrop-blur-md bg-gradient-to-bl from-[rgba(0,0,0,0.8)] to-[rgba(139,92,137,0.9)] border border-white/10 z-50">
                      <div className="py-2 flex flex-col text-white text-[14px]">
                        <Link href="/account" className="flex items-center px-4 py-2.5 hover:bg-white/10 transition-colors">
                          <User className="h-5 w-5 mr-3" strokeWidth={1.5} />
                          <span>Manage My Account</span>
                        </Link>
                        <Link href="/orders" className="flex items-center px-4 py-2.5 hover:bg-white/10 transition-colors">
                          <ShoppingBag className="h-5 w-5 mr-3" strokeWidth={1.5} />
                          <span>My Order</span>
                        </Link>
                        <Link href="/cancellations" className="flex items-center px-4 py-2.5 hover:bg-white/10 transition-colors">
                          <XCircle className="h-5 w-5 mr-3" strokeWidth={1.5} />
                          <span>My Cancellations</span>
                        </Link>
                        <Link href="/reviews" className="flex items-center px-4 py-2.5 hover:bg-white/10 transition-colors">
                          <Star className="h-5 w-5 mr-3" strokeWidth={1.5} />
                          <span>My Reviews</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors">
                          <LogOut className="h-5 w-5 mr-3" strokeWidth={1.5} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
