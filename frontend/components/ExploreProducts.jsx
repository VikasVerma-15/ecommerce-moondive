import ExploreProductsSlider from './ExploreProductsSlider';

const getAllProducts = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/v1/products', { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    if (error?.digest?.includes('DYNAMIC_SERVER_USAGE') || error?.message?.includes('Dynamic server usage')) throw error;
    console.error("Failed to fetch products:", error);
    return [];
  }
};

const mapProductData = (p) => {
  const currentPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
  const originalPrice = p.discountPrice > 0 ? p.price : null;
  const discount = p.discountPrice > 0 ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : null;

  return {
    id: p._id,
    title: p.title,
    price: currentPrice,
    originalPrice: originalPrice,
    discount: discount,
    image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80',
    isNewArrival: p.isNewArrival
  };
};

const ExploreProducts = async () => {
  const backendProducts = await getAllProducts();
  const products = backendProducts.map(mapProductData);

  return (
    <section className="section-width px-4 xl:px-0 py-10 mt-10 border-b border-gray-200">
      {/* Section Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
        <span className="text-[#DB4444] font-bold text-base">Our Products</span>
      </div>

      <ExploreProductsSlider products={products} />
    </section>
  );
};

export default ExploreProducts;
