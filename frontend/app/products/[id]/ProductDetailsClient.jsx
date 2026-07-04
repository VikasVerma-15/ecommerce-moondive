"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Minus, Plus, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsClient({ product, relatedProducts }) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWished, setIsWished] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { id: 'blue', class: 'bg-[#98B7D5]' },
    { id: 'red', class: 'bg-[#E07575]' },
  ];

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to cart');
      return;
    }

    try {
      setIsAdding(true);
      await api.post('/cart', { productId: product._id, quantity });
      toast.success('Item buyed');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      toast.error('Failed to add to cart');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      setIsWished(true);
      await api.post('/wishlist', { productId: product._id });
      toast.success('Added to wishlist');
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      toast.error('Failed to add to wishlist');
      console.error(err);
      setIsWished(false);
    }
  };

  // Mock multiple images if only 1 exists for the gallery
  const galleryImages = product.images?.length > 1 
    ? product.images 
    : [selectedImage, selectedImage, selectedImage, selectedImage];

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="section-width px-4 xl:px-0 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-10 flex items-center gap-2 font-medium">
        <Link href="/" className="hover:text-[#DB4444] transition-colors">Home</Link>
        <ChevronRight size={16} />
        <Link href={`/products?category=${typeof product.category === 'object' ? (product.category.slug || product.category.name) : product.category}`} className="hover:text-[#DB4444] transition-colors capitalize">
          {typeof product.category === 'object' ? product.category.name : 'Category'}
        </Link>
        <ChevronRight size={16} />
        <span className="text-black">{product.title}</span>
      </div>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
        
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:w-[60%]">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] bg-[#F5F5F5] rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all duration-300 flex-shrink-0 hover:border-gray-300 ${selectedImage === img ? 'border-[#DB4444] shadow-md' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumbnail" className="w-[80%] h-[80%] object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="bg-[#F5F5F5] rounded-2xl flex-1 flex items-center justify-center h-[400px] lg:h-[600px] p-8 group overflow-hidden">
            <img src={selectedImage} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out" />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col lg:w-[40%] pt-4 lg:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-[#DB4444]">
              ${currentPrice.toFixed(2)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xl text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-base text-gray-600 leading-relaxed pb-8 border-b border-gray-200">
            {product.description}
          </p>

          {/* Colours */}
          <div className="flex items-center gap-8 mt-8">
            <span className="text-lg font-medium text-gray-900 w-16">Colours:</span>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.class} flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 ${selectedColor === c.id ? 'border-black ring-4 ring-white shadow-md' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-8 mt-6">
            <span className="text-lg font-medium text-gray-900 w-16">Size:</span>
            <div className="flex gap-3">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-lg border-2 transition-all duration-300 ${
                    selectedSize === s 
                      ? 'bg-[#DB4444] text-white border-[#DB4444] shadow-md transform scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#DB4444] hover:text-[#DB4444]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions: Qty, Buy, Wishlist */}
          <div className="flex items-center gap-4 mt-10">
            {/* Quantity */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg h-12 overflow-hidden bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors border-r-2 border-gray-200 hover:border-[#DB4444]"
              >
                <Minus size={18} />
              </button>
              <span className="w-16 h-full flex items-center justify-center font-bold text-lg text-gray-900">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center bg-[#DB4444] text-white hover:bg-red-600 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Buy Now (Add to Cart) */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 h-12 bg-[#DB4444] text-white font-semibold rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-600 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>

            {/* Wishlist */}
            <button 
              onClick={handleAddToWishlist}
              className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                isWished ? 'border-[#DB4444] bg-red-50 text-[#DB4444]' : 'border-gray-200 text-gray-600 hover:border-[#DB4444] hover:text-[#DB4444] bg-white'
              }`}
            >
              <Heart size={22} className={`pointer-events-none transition-transform duration-300 ${isWished ? 'fill-current scale-110' : ''}`} />
            </button>
          </div>

          {/* Delivery Box */}
          <div className="mt-12 border-2 border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex gap-5 items-center p-6 border-b-2 border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-red-50 text-[#DB4444] rounded-full group-hover:scale-110 transition-transform duration-300">
                <Truck size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                <p className="text-sm text-gray-500 font-medium mt-1 group-hover:text-[#DB4444] transition-colors">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center p-6 group cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-red-50 text-[#DB4444] rounded-full group-hover:scale-110 transition-transform duration-300">
                <RefreshCw size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Return Delivery</h4>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Free 30 Days Delivery Returns. <span className="text-[#DB4444] hover:underline font-semibold">Details</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Items */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-24 mb-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
            <h2 className="text-base font-bold text-[#DB4444]">Related Item</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
