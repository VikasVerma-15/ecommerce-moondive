"use client";

import { Heart, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to cart');
      return;
    }

    try {
      setIsAdding(true);
      await api.post('/cart', { productId: product.id, quantity: 1 });
      toast.success('Added to cart');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      toast.error('Failed to add to cart');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const [isWished, setIsWished] = useState(false);

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      setIsWished(true);
      await api.post('/wishlist', { productId: product.id });
      toast.success('Added to wishlist');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      toast.error('Failed to add to wishlist');
      console.error(err);
      setIsWished(false);
    }
  };

  return (
    <div 
      onClick={() => router.push(`/products/${product.id || product._id}`)}
      className="flex flex-col group cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white rounded-xl overflow-hidden pb-3"
    >
      {/* Image Container with gray background */}
      <div className="relative bg-[#F5F5F5] rounded-t-xl h-[250px] w-full flex items-center justify-center overflow-hidden">
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs px-3 py-1 rounded shadow-md z-10">
            -{product.discount}%
          </div>
        )}
        
        {/* Actions (Wishlist & View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button onClick={handleAddToWishlist} className={`bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all duration-300 ${isWished ? 'text-[#DB4444]' : 'text-black hover:text-[#DB4444]'}`}>
            <Heart size={20} className={`pointer-events-none ${isWished ? 'fill-current' : ''}`} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.id || product._id}`); }} className="bg-white rounded-full p-2 shadow-md hover:scale-110 hover:text-[#DB4444] transition-all duration-300">
            <Eye size={20} className="text-black pointer-events-none transition-colors" />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-3/4 h-3/4">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Add to Cart Hover Banner */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="absolute bottom-0 left-0 w-full bg-black hover:bg-[#DB4444] text-white text-center py-3 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-all duration-300 disabled:bg-gray-800 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
        >
          {isAdding ? "Adding..." : "Add To Cart"}
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4 px-3 flex flex-col gap-1">
        <h3 className="font-medium text-base text-gray-900 group-hover:text-[#DB4444] transition-colors truncate">{product.title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[#DB4444] font-semibold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
