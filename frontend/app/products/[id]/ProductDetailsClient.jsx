"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Minus, Plus, Truck, RefreshCw } from 'lucide-react';
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
      <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/account" className="hover:text-black">Account</Link>
        <span>/</span>
        <Link href={`/products?category=${typeof product.category === 'object' ? (product.category.slug || product.category.name) : product.category}`} className="hover:text-black">
          {typeof product.category === 'object' ? product.category.name : 'Category'}
        </Link>
        <span>/</span>
        <span className="text-black font-medium">{product.title}</span>
      </div>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
        
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-[60%]">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`w-[100px] h-[100px] lg:w-[170px] lg:h-[138px] bg-[#F5F5F5] rounded flex items-center justify-center cursor-pointer border-2 transition-colors flex-shrink-0 ${selectedImage === img ? 'border-gray-400' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumbnail" className="w-[80%] h-[80%] object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="bg-[#F5F5F5] rounded flex-1 flex items-center justify-center h-[350px] lg:h-[600px] p-8">
            <img src={selectedImage} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col lg:w-[40%]">
          <h1 className="text-2xl font-semibold tracking-wide text-gray-900 mb-4">{product.title}</h1>
          
          <div className="text-2xl font-medium tracking-wide text-gray-900 mb-6">
            ${currentPrice.toFixed(2)}
          </div>

          <p className="text-sm text-gray-900 leading-relaxed pb-6 border-b border-gray-300">
            {product.description}
          </p>

          {/* Colours */}
          <div className="flex items-center gap-6 mt-6">
            <span className="text-xl tracking-wide text-gray-900">Colours:</span>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-5 h-5 rounded-full ${c.class} flex items-center justify-center border-2 transition-all ${selectedColor === c.id ? 'border-black ring-2 ring-white scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-6 mt-6">
            <span className="text-xl tracking-wide text-gray-900">Size:</span>
            <div className="flex gap-4">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded border transition-colors ${
                    selectedSize === s 
                      ? 'bg-[#DB4444] text-white border-[#DB4444]' 
                      : 'bg-white text-black border-gray-300 hover:border-[#DB4444]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions: Qty, Buy, Wishlist */}
          <div className="flex items-center gap-4 mt-8">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded h-11">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors rounded-l border-r border-gray-300"
              >
                <Minus size={16} />
              </button>
              <span className="w-16 h-full flex items-center justify-center font-medium text-lg">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center bg-[#DB4444] text-white hover:bg-red-600 transition-colors rounded-r"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Buy Now (Add to Cart) */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="h-11 px-12 bg-[#DB4444] text-white font-medium rounded hover:bg-red-600 transition-colors disabled:opacity-70"
            >
              {isAdding ? 'Adding...' : 'Buy Now'}
            </button>

            {/* Wishlist */}
            <button 
              onClick={handleAddToWishlist}
              className={`w-11 h-11 border rounded flex items-center justify-center transition-colors ${
                isWished ? 'border-[#DB4444] text-[#DB4444]' : 'border-gray-300 text-black hover:border-black'
              }`}
            >
              <Heart size={20} className={`pointer-events-none ${isWished ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Delivery Box */}
          <div className="mt-10 border border-gray-300 rounded overflow-hidden">
            <div className="flex gap-4 items-center p-6 border-b border-gray-300">
              <Truck size={32} strokeWidth={1.5} />
              <div>
                <h4 className="font-medium text-black">Free Delivery</h4>
                <p className="text-xs text-black font-medium mt-1 underline cursor-pointer">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-6">
              <RefreshCw size={32} strokeWidth={1.5} />
              <div>
                <h4 className="font-medium text-black">Return Delivery</h4>
                <p className="text-xs text-black font-medium mt-1">
                  Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span>
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
