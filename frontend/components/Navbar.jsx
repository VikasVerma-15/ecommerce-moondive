"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, User, ShoppingBag, XCircle, Star, LogOut, Menu, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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



  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?category=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
    return `font-medium hover:text-[#DB4444] transition-colors hover-underline-animation ${
      pathname === path 
        ? 'text-[#DB4444] font-semibold' 
        : 'text-gray-800'
    }`;
  };

  return (
    <div className="w-full border-b border-gray-200/50 sticky top-0 z-50 glass transition-all duration-300">
      <div className="section-width px-4 xl:px-0 py-[16px]">
        <div className="flex items-center justify-between h-[38px] lg:gap-[148px]">
          
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-900 hover:text-[#DB4444] transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
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
            <div className="relative hidden sm:block group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you looking for?"
                className="w-48 lg:w-64 bg-[#f5f5f5] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB4444]/50 transition-all duration-300"
              />
              <button onClick={handleSearch} className="absolute right-3 top-2.5 text-gray-500 hover:text-[#DB4444] transition-colors cursor-pointer">
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 relative">
              <Link href="/wishlist" className="text-gray-900 hover:text-[#DB4444] hover:scale-110 transition-all duration-300 relative flex items-center justify-center h-8 w-8">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#DB4444] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-md animate-fade-in-up">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="text-gray-900 hover:text-[#DB4444] hover:scale-110 transition-all duration-300 relative flex items-center justify-center h-8 w-8">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#DB4444] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 shadow-md animate-fade-in-up">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 ${dropdownOpen ? 'bg-[#db4444] text-white shadow-lg' : 'text-gray-900 hover:text-[#DB4444]'}`}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col py-4 px-6 z-40 animate-fade-in-up">
          {/* Mobile Search */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                  setMobileMenuOpen(false);
                }
              }}
              placeholder="Search products..."
              className="w-full bg-[#f5f5f5] rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB4444]/50"
            />
            <button 
              onClick={() => { handleSearch(); setMobileMenuOpen(false); }} 
              className="absolute right-3 top-3 text-gray-500 hover:text-[#DB4444]"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-[#DB4444] py-2 border-b border-gray-50">
              Home
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-[#DB4444] py-2 border-b border-gray-50">
              Contact
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-[#DB4444] py-2 border-b border-gray-50">
              About
            </Link>
            {!isLoggedIn && (
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-gray-900 font-medium hover:text-[#DB4444] py-2 border-b border-gray-50">
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
