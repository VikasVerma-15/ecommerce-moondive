"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Eye } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [justForYou, setJustForYou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movingToBag, setMovingToBag] = useState(false);

  useEffect(() => {
    fetchWishlistAndRecommendations();
  }, []);

  const fetchWishlistAndRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your wishlist.");
        setLoading(false);
        return;
      }
      
      // Fetch wishlist
      const res = await api.get("/wishlist");
      setWishlistItems(res.data.data?.products || []);

      // Fetch "Just For You" - fallback to recent products
      const productsRes = await api.get("/products");
      const allProducts = productsRes.data.data || [];
      // Grab 4 products for recommendation
      setJustForYou(allProducts.slice(0, 4));

    } catch (err) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(p => p._id !== productId));
      toast.success("Item removed from wishlist");
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      toast.error("Failed to remove item");
      console.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart', { productId, quantity: 1 });
      toast.success("Added to cart");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    }
  };

  const handleMoveAllToBag = async () => {
    if (wishlistItems.length === 0) return;
    setMovingToBag(true);
    try {
      // Add all to cart
      for (const item of wishlistItems) {
        await api.post('/cart', { productId: item._id, quantity: 1 });
      }
      toast.success("Moved all items to bag");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      toast.error("Failed to move some items to bag");
      console.error(err);
    } finally {
      setMovingToBag(false);
    }
  };

  if (loading) {
    return <div className="section-width py-20 text-center text-gray-500">Loading wishlist...</div>;
  }

  if (error) {
    return (
      <div className="section-width py-20 flex flex-col items-center">
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/login" className="bg-[#db4444] text-white px-8 py-3 rounded-md font-medium hover:bg-red-600 transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col bg-white">
      <div className="section-width px-4 xl:px-0 py-10 mt-10">
        
        {/* Top Header Section */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl text-black font-medium">Wishlist ({wishlistItems.length})</h2>
          <button 
            onClick={handleMoveAllToBag}
            disabled={movingToBag || wishlistItems.length === 0}
            className="px-8 py-3 border border-gray-400 text-black font-medium rounded-[4px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {movingToBag ? "Moving..." : "Move All To Bag"}
          </button>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
            {wishlistItems.map((product) => {
              const price = product.discountPrice > 0 ? product.discountPrice : product.price;
              const originalPrice = product.price;
              const image = product.images && product.images.length > 0 ? product.images[0] : "";

              return (
                <div key={product._id} className="flex flex-col group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative bg-[#F5F5F5] rounded-md h-[250px] w-full flex items-center justify-center overflow-hidden">
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs px-3 py-1 rounded">
                        -{product.discount}%
                      </div>
                    )}
                    
                    {/* Remove Action */}
                    <div className="absolute top-3 right-3 z-10">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFromWishlist(product._id);
                        }} 
                        className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors text-black relative z-20"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative w-3/4 h-3/4">
                      {image ? (
                        <Image src={image} alt={product.title} fill className="object-contain group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                      className="absolute bottom-0 w-full bg-black text-white text-center py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10"
                    >
                      <ShoppingCart size={16} />
                      Add To Cart
                    </button>
                  </div>

                  {/* Details (No Rating) */}
                  <div className="mt-4 flex flex-col gap-1">
                    <h3 className="font-medium text-base text-black truncate">{product.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[#DB4444] font-medium">${price}</span>
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through text-sm">${originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Just For You Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
              <h2 className="text-[#DB4444] text-xl font-medium">Just For You</h2>
            </div>
            <Link href="/products" className="px-8 py-3 border border-gray-400 text-black font-medium rounded-[4px] hover:bg-gray-50 transition-colors">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
            {justForYou.map((product) => {
              const price = product.discountPrice > 0 ? product.discountPrice : product.price;
              const originalPrice = product.price;
              const image = product.images && product.images.length > 0 ? product.images[0] : "";

              return (
                <div key={product._id} className="flex flex-col group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative bg-[#F5F5F5] rounded-md h-[250px] w-full flex items-center justify-center overflow-hidden">
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs px-3 py-1 rounded">
                        -{product.discount}%
                      </div>
                    )}
                    {product.isNewArrival && !product.discount && (
                      <div className="absolute top-3 left-3 bg-[#00FF66] text-white text-xs px-3 py-1 rounded">
                        NEW
                      </div>
                    )}
                    
                    {/* View Action */}
                    <div className="absolute top-3 right-3 z-10">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors text-black relative z-20"
                      >
                        <Eye size={20} />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative w-3/4 h-3/4">
                      {image ? (
                        <Image src={image} alt={product.title} fill className="object-contain group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                      className="absolute bottom-0 w-full bg-black text-white text-center py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10"
                    >
                      <ShoppingCart size={16} />
                      Add To Cart
                    </button>
                  </div>

                  {/* Details (No Rating) */}
                  <div className="mt-4 flex flex-col gap-1">
                    <h3 className="font-medium text-base text-black truncate">{product.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[#DB4444] font-medium">${price}</span>
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through text-sm">${originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
