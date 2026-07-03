import FlashSalesSlider from './FlashSalesSlider';
import Link from 'next/link';
import { getApiUrl } from '@/lib/apiUrl';

const getFlashSaleProducts = async () => {
  try {
    const res = await fetch(getApiUrl('products?isFlashSale=true'), { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    if (error?.digest?.includes('DYNAMIC_SERVER_USAGE') || error?.message?.includes('Dynamic server usage')) throw error;
    console.error("Failed to fetch flash sale products:", error);
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

const FlashSales = async () => {
  const backendProducts = await getFlashSaleProducts();
  const products = backendProducts.map(mapProductData); // Fetch all flash sale items for slider

  return (
    <section className="section-width px-4 xl:px-0 py-10 mt-10 border-y border-gray-200">
      {/* Section Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
        <span className="text-[#DB4444] font-bold text-base">Today's</span>
      </div>

      <FlashSalesSlider products={products} />

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <Link href="/flash-sales" className="bg-[#DB4444] text-white px-12 py-4 rounded-[4px] font-medium hover:bg-red-600 transition-colors">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FlashSales;
