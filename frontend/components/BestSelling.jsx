import ProductCard from './ProductCard';
import Link from 'next/link';
import { getApiUrl } from '@/lib/apiUrl';

const getBestSellingProducts = async () => {
  try {
    const res = await fetch(getApiUrl('products?isBestSeller=true'), { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    if (error?.digest?.includes('DYNAMIC_SERVER_USAGE') || error?.message?.includes('Dynamic server usage')) throw error;
    console.error("Failed to fetch best selling products:", error);
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
    flashSaleEndDate: p.flashSaleEndDate,
  };
};

const BestSelling = async () => {
  const backendProducts = await getBestSellingProducts();
  const products = backendProducts.map(mapProductData).slice(0, 4); // Show up to 4 items on home page

  return (
    <section className="section-width px-4 xl:px-0 py-10 mt-10 border-b border-gray-200">
      {/* Section Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
        <span className="text-[#DB4444] font-bold text-base">This Month</span>
      </div>

      {/* Header and View All */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 md:gap-0">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Best Selling Products</h2>
        
        <Link 
          href="/best-selling" 
          className="bg-[#DB4444] text-white px-10 py-3.5 rounded-[4px] font-medium hover:bg-red-600 transition-colors w-max"
        >
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No best selling products available right now.</p>
        )}
      </div>
    </section>
  );
};

export default BestSelling;
