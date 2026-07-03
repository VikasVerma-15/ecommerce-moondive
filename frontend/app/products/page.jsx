import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getApiUrl } from '@/lib/apiUrl';

const getProducts = async (category) => {
  try {
    const url = category
      ? getApiUrl(`products?category=${category}`)
      : getApiUrl('products');
    const res = await fetch(url, { cache: 'no-store' });
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
    flashSaleEndDate: p.flashSaleEndDate,
  };
};

// Note: Next.js app router passes searchParams as a promise in page components.
export default async function ProductsPage(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || '';
  
  const backendProducts = await getProducts(category);
  const products = backendProducts.map(mapProductData);

  return (
    <main className="flex-grow flex flex-col bg-white">
      <section className="section-width px-4 xl:px-0 py-4 mt-2 min-h-screen">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-8 flex items-center">
          <Link href="/" className="flex items-center text-gray-500 hover:text-black transition-colors gap-2">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black capitalize">
            {category ? `${category} Products` : 'All Products'}
          </h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full py-12 text-center text-lg">No products found in this category.</p>
          )}
        </div>
      </section>
    </main>
  );
}
