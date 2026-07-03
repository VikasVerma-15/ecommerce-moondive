"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }
      const response = await api.get("https://ecommerce-moondive-1.onrender.com/api/v1/cart");
      setCartItems(response.data.data?.items || []);
    } catch (err) {
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    // Optimistic UI update
    setCartItems(prev => prev.map(item => 
      item.product._id === productId ? { ...item, quantity: newQty } : item
    ));

    try {
      await api.put("/cart", { productId, quantity: newQty });
      window.dispatchEvent(new Event('cartUpdated'));
      // Fetch cart to sync completely
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity");
      fetchCart(); // revert
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      setCartItems(prev => prev.filter(item => item.product._id !== productId));
      toast.success("Item removed from cart");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      toast.error("Failed to remove item");
      console.error("Failed to remove item");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div className="section-width py-20 text-center text-gray-500">Loading cart...</div>;
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

  const subtotal = calculateSubtotal();

  return (
    <main className="flex-grow flex flex-col bg-white">
      <div className="section-width px-4 xl:px-0 py-10">
        
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm mb-12">
          <Link href="/" className="text-gray-500 hover:text-black">Home</Link>
          <span className="text-gray-500">/</span>
          <span className="text-black font-medium">Cart</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <h2 className="text-2xl font-medium mb-6">Your cart is empty</h2>
            <Link href="/" className="px-8 py-3 border border-gray-300 rounded-[4px] font-medium hover:bg-gray-50 transition-colors">
              Return To Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Cart Table Headers */}
            <div className="grid grid-cols-4 bg-white shadow-sm border border-gray-100 rounded-[4px] py-6 px-10">
              <div className="font-medium text-black">Product</div>
              <div className="font-medium text-black">Price</div>
              <div className="font-medium text-black">Quantity</div>
              <div className="font-medium text-black text-right">Subtotal</div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => {
                const product = item.product;
                const price = product.discountPrice > 0 ? product.discountPrice : product.price;
                const itemSubtotal = price * item.quantity;
                const image = product.images && product.images.length > 0 ? product.images[0] : "";

                return (
                  <div key={product._id} className="grid grid-cols-4 items-center bg-white shadow-sm border border-gray-100 rounded-[4px] py-6 px-10 relative">
                    
                    {/* Product */}
                    <div className="flex items-center gap-4 relative">
                      <button 
                        onClick={() => handleRemoveItem(product._id)}
                        className="absolute -top-2 -left-2 bg-[#db4444] text-white rounded-full p-0.5 hover:bg-red-600 z-10"
                      >
                        <X size={14} />
                      </button>
                      {image ? (
                        <div className="w-14 h-14 relative flex-shrink-0">
                          <Image src={image} alt={product.title} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 flex-shrink-0 rounded-sm"></div>
                      )}
                      <span className="text-black truncate pr-4">{product.title}</span>
                    </div>

                    {/* Price */}
                    <div className="text-black">
                      ${price}
                    </div>

                    {/* Quantity */}
                    <div>
                      <div className="flex items-center justify-between w-20 border border-gray-300 rounded-[4px] px-3 py-1.5">
                        <span className="text-black">{String(item.quantity).padStart(2, '0')}</span>
                        <div className="flex flex-col">
                          <button onClick={() => handleUpdateQuantity(product._id, item.quantity, 1)} className="hover:text-gray-600">
                            <ChevronUp size={14} />
                          </button>
                          <button onClick={() => handleUpdateQuantity(product._id, item.quantity, -1)} className="hover:text-gray-600">
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-black text-right">
                      ${itemSubtotal}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Cart Actions */}
            <div className="flex justify-between mt-4">
              <Link href="/" className="px-10 py-4 border border-gray-400 text-black font-medium rounded-[4px] hover:bg-gray-50 transition-colors">
                Return To Shop
              </Link>
              <button onClick={() => fetchCart()} className="px-10 py-4 border border-gray-400 text-black font-medium rounded-[4px] hover:bg-gray-50 transition-colors">
                Update Cart
              </button>
            </div>

            {/* Cart Total Section */}
            <div className="flex justify-end mt-12 mb-20">
              <div className="w-full md:w-[470px] border border-black rounded-[4px] px-6 py-8">
                <h3 className="text-xl font-medium text-black mb-6">Cart Total</h3>
                
                <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                  <span className="text-black">Subtotal:</span>
                  <span className="text-black">${subtotal}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                  <span className="text-black">Shipping:</span>
                  <span className="text-black">Free</span>
                </div>
                
                <div className="flex justify-between pb-4">
                  <span className="text-black">Total:</span>
                  <span className="text-black">${subtotal}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
