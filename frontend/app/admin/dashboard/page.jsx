"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { ShoppingBag, HelpCircle, DollarSign, Package, Tag, Star, Sun, UploadCloud } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactsError, setContactsError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // For Add Product
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    isFlashSale: false,
    flashSaleEndDate: "",
    isBestSeller: false,
    isNewArrival: false
  });
  const [images, setImages] = useState(null);

  // For Edit Product Modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin");
      return;
    }
    fetchProducts();
    fetchContacts();
  }, [router]);

  async function fetchProducts() {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  }

  async function fetchContacts() {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data.data || []);
      setContactsError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setContactsError(msg);
      toast.error("Failed to fetch contacts: " + msg);
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEditChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditFormData({ ...editFormData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.discountPrice) {
      data.append("discountPrice", formData.discountPrice);
    }
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("isFlashSale", formData.isFlashSale);
    if (formData.isFlashSale && formData.flashSaleEndDate) {
      data.append("flashSaleEndDate", formData.flashSaleEndDate);
    }
    data.append("isBestSeller", formData.isBestSeller);
    data.append("isNewArrival", formData.isNewArrival);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }
    }

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Product added successfully!");
      setFormData({ 
        title: "", description: "", price: "", discountPrice: "", 
        stock: "", category: "", isFlashSale: false, flashSaleEndDate: "", isBestSeller: false, isNewArrival: false 
      });
      setImages(null);
      e.target.reset();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product. Please check the inputs.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      category: typeof product.category === 'object' ? product.category?.name : product.category,
      isFlashSale: product.isFlashSale || false,
      flashSaleEndDate: product.flashSaleEndDate ? new Date(product.flashSaleEndDate).toISOString().slice(0, 16) : "",
      isBestSeller: product.isBestSeller || false,
      isNewArrival: product.isNewArrival || false
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");

    try {
      const data = new FormData();
      data.append("title", editFormData.title);
      data.append("description", editFormData.description);
      data.append("price", editFormData.price);
      if (editFormData.discountPrice) {
        data.append("discountPrice", editFormData.discountPrice);
      } else {
        data.append("discountPrice", 0); // Reset discount
      }
      data.append("stock", editFormData.stock);
      data.append("category", editFormData.category);
      data.append("isFlashSale", editFormData.isFlashSale);
      if (editFormData.isFlashSale && editFormData.flashSaleEndDate) {
        data.append("flashSaleEndDate", editFormData.flashSaleEndDate);
      }
      data.append("isBestSeller", editFormData.isBestSeller);
      data.append("isNewArrival", editFormData.isNewArrival);

      await api.put(`/products/${editingProduct._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      closeEditModal();
      fetchProducts();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <main className="section-width py-12 relative">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* TAB NAVIGATION */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("products")}
            className={`py-4 px-8 font-medium text-lg transition-colors border-b-2 ${activeTab === "products" ? "border-[#db4444] text-[#db4444]" : "border-transparent text-gray-500 hover:text-gray-900"}`}
          >
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab("contacts")}
            className={`py-4 px-8 font-medium text-lg transition-colors border-b-2 ${activeTab === "contacts" ? "border-[#db4444] text-[#db4444]" : "border-transparent text-gray-500 hover:text-gray-900"}`}
          >
            Contact Messages
          </button>
        </div>

        {activeTab === "products" && (
          <>
            {/* ADD PRODUCT FORM */}
            <div className="bg-[#F8F9FA] p-8 -mx-8 -mt-8 rounded-b-md">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 w-full max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <ShoppingBag size={24} className="text-[#DB4444]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
                      <p className="text-sm text-gray-500">Add a new product to the database.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <ShoppingBag size={20} className="text-[#DB4444]" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  
                  {/* Title & Category */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Product Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter product title" className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <div className="relative">
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Electronics, Clothing..." className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 appearance-none focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm" />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe your product..." rows={4} className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm resize-none" />
                  </div>

                  {/* Price, Discount, Stock */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Price ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 pr-3 bg-gray-50 rounded-l-md">
                          <DollarSign size={16} className="text-gray-500" />
                        </div>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" className="w-full bg-white border border-gray-200 rounded-md py-2.5 pl-14 pr-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Discount Price</label>
                      <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} min="0" step="0.01" placeholder="Optional" className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Stock Qty</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 pr-3 bg-gray-50 rounded-l-md">
                          <Package size={16} className="text-gray-500" />
                        </div>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" placeholder="0" className="w-full bg-white border border-gray-200 rounded-md py-2.5 pl-14 pr-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] focus:border-[#DB4444] text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Custom Checkboxes */}
                  <div className="grid grid-cols-3 gap-6">
                    <label className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${formData.isFlashSale ? 'border-[#DB4444] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="checkbox" name="isFlashSale" checked={formData.isFlashSale} onChange={handleChange} className="hidden" />
                      <Tag size={20} className={formData.isFlashSale ? "text-[#DB4444]" : "text-gray-400"} />
                      <span className="text-sm font-medium text-gray-700">Is Flash Sale?</span>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${formData.isBestSeller ? 'border-[#DB4444] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="hidden" />
                      <Star size={20} className={formData.isBestSeller ? "text-[#DB4444]" : "text-gray-400"} />
                      <span className="text-sm font-medium text-gray-700">Is Best Seller?</span>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${formData.isNewArrival ? 'border-[#DB4444] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="hidden" />
                      <Sun size={20} className={formData.isNewArrival ? "text-[#DB4444]" : "text-gray-400"} />
                      <span className="text-sm font-medium text-gray-700">Is New Arrival?</span>
                    </label>
                  </div>

                  {formData.isFlashSale && (
                    <div className="flex flex-col gap-2 w-1/3">
                      <label className="text-sm font-medium text-gray-700">Flash Sale End Date</label>
                      <input type="datetime-local" name="flashSaleEndDate" value={formData.flashSaleEndDate} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#DB4444] text-sm" />
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Product Images (Max 5)</label>
                    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                          <UploadCloud size={20} className="text-[#DB4444]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Choose files <span className="font-normal text-gray-500">or drag and drop</span></p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                        </div>
                      </div>
                      <button type="button" className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 pointer-events-none bg-white">
                        Browse Files
                      </button>
                    </div>
                    {images && <p className="text-sm text-green-600 mt-1">{images.length} file(s) selected</p>}
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-600 text-sm">{success}</p>}

                  <button type="submit" disabled={loading} className="w-full h-14 mt-4 bg-[#DB4444] text-white font-medium rounded-md hover:bg-red-600 transition-colors disabled:bg-red-400 flex items-center justify-center gap-2">
                    <Package size={20} />
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </form>
              </div>
            </div>

        {/* LIST OF PRODUCTS */}
        <div className="bg-white shadow-md rounded-md p-8 border border-gray-100">
          <h2 className="text-2xl font-medium tracking-wide mb-6 text-gray-900">All Products</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Image</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {product.images && product.images.length > 0 ? (
                          <Image src={product.images[0]} alt={product.title} width={40} height={40} className="object-cover rounded-md h-10 w-10" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {product.title}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {product.isFlashSale && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Flash Sale</span>}
                          {product.isBestSeller && <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">Best Seller</span>}
                          {product.isNewArrival && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">New Arrival</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        ${product.price}
                        {product.discountPrice > 0 && <span className="text-gray-400 line-through text-xs ml-2">${product.discountPrice}</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openEditModal(product)} className="text-[#db4444] hover:text-red-700 text-sm font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white shadow-md rounded-md p-8 border border-gray-100">
            <h2 className="text-2xl font-medium tracking-wide mb-6 text-gray-900">Contact Messages</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contactsError ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-red-500 font-medium">
                        Access Denied: {contactsError} (Please log out and log back in as an Admin)
                      </td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No contact messages found.</td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                        <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {contact.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <a href={`mailto:${contact.email}`} className="text-[#db4444] hover:underline">{contact.email}</a>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {contact.phone}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm max-w-xs break-words">
                          {contact.message}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-md shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-medium tracking-wide mb-6 text-gray-900">Edit Product</h2>
            
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-medium">Product Title</label>
                  <input type="text" name="title" value={editFormData.title} onChange={handleEditChange} required className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-medium">Category</label>
                  <input type="text" name="category" value={editFormData.category} onChange={handleEditChange} required className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-500 font-medium">Description</label>
                <textarea name="description" value={editFormData.description} onChange={handleEditChange} required rows={3} className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-medium">Price ($)</label>
                  <input type="number" name="price" value={editFormData.price} onChange={handleEditChange} required min="0" step="0.01" className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-medium">Discount Price</label>
                  <input type="number" name="discountPrice" value={editFormData.discountPrice} onChange={handleEditChange} min="0" step="0.01" placeholder="Optional" className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-medium">Stock Qty</label>
                  <input type="number" name="stock" value={editFormData.stock} onChange={handleEditChange} required min="0" className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                </div>
              </div>

              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input type="checkbox" name="isFlashSale" checked={editFormData.isFlashSale} onChange={handleEditChange} className="w-5 h-5 text-[#db4444] rounded border-gray-300 focus:ring-[#db4444]" />
                    Is Flash Sale?
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input type="checkbox" name="isBestSeller" checked={editFormData.isBestSeller} onChange={handleEditChange} className="w-5 h-5 text-[#db4444] rounded border-gray-300 focus:ring-[#db4444]" />
                    Is Best Seller?
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input type="checkbox" name="isNewArrival" checked={editFormData.isNewArrival} onChange={handleEditChange} className="w-5 h-5 text-[#db4444] rounded border-gray-300 focus:ring-[#db4444]" />
                    Is New Arrival?
                  </label>
                </div>
                
                {editFormData.isFlashSale && (
                  <div className="flex flex-col gap-2 w-1/2">
                    <label className="text-sm text-gray-500 font-medium">Flash Sale End Date & Time</label>
                    <input type="datetime-local" name="flashSaleEndDate" value={editFormData.flashSaleEndDate} onChange={handleEditChange} required className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                  </div>
                )}
              </div>

              {editError && <p className="text-red-500 text-sm">{editError}</p>}

              <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={closeEditModal} className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="px-6 py-3 bg-[#db4444] text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-400">
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
