"use client";

import { Heart, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);

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
    <div className="flex flex-col group cursor-pointer">
      {/* Image Container with gray background */}
      <div className="relative bg-[#F5F5F5] rounded-md h-[250px] w-full flex items-center justify-center overflow-hidden">
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs px-3 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        
        {/* Actions (Wishlist & View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={handleAddToWishlist} className={`bg-white rounded-full p-2 shadow-sm transition-colors ${isWished ? 'text-[#DB4444]' : 'text-black hover:bg-gray-100'}`}>
            <Heart size={20} className={isWished ? 'fill-current' : ''} />
          </button>
          <button className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors">
            <Eye size={20} className="text-black" />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-3/4 h-3/4">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Add to Cart Hover Banner */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="absolute bottom-0 w-full bg-black text-white text-center py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:bg-gray-800"
        >
          {isAdding ? "Adding..." : "Add To Cart"}
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="font-medium text-base text-black truncate">{product.title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[#DB4444] font-medium">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
