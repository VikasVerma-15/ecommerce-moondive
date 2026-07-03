import Link from 'next/link';
import ProductDetailsClient from './ProductDetailsClient';

const getProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
};

const getRelatedProducts = async (categoryId, currentProductId) => {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/products?category=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const allProducts = json.data || [];
    return allProducts.filter(p => p._id !== currentProductId).slice(0, 4); // return up to 4 related
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
};

export default async function ProductDetailsPage({ params }) {
  // Await the params object in Next.js 15
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    return (
      <div className="section-width py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#DB4444] hover:underline">Return to Home</Link>
      </div>
    );
  }

  const categoryIdentifier = typeof product.category === 'object' ? (product.category.slug || product.category.name) : product.category;
  const relatedProductsRaw = await getRelatedProducts(categoryIdentifier, product._id);
  
  const relatedProducts = relatedProductsRaw.map((p) => ({
    id: p._id,
    title: p.title,
    price: p.discountPrice > 0 ? p.discountPrice : p.price,
    originalPrice: p.discountPrice > 0 ? p.price : null,
    discount: p.discountPrice > 0 ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : null,
    image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80',
    flashSaleEndDate: p.flashSaleEndDate,
  }));

  return (
    <main className="flex-grow flex flex-col bg-white">
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
