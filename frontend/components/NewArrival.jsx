import Link from 'next/link';

const getNewArrivals = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/v1/products?isNewArrival=true', { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    if (error?.digest?.includes('DYNAMIC_SERVER_USAGE') || error?.message?.includes('Dynamic server usage')) throw error;
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};

export default async function NewArrival() {
  const newArrivals = await getNewArrivals();

  const items = [
    { title: "PlayStation 5", description: "Black and White version of the PS5 coming out on sale.", link: "/products", image: "" },
    { title: "Women's Collections", description: "Featured woman collections that give you another vibe.", link: "/products", image: "" },
    { title: "Speakers", description: "Amazon wireless speakers", link: "/products", image: "" },
    { title: "Perfume", description: "GUCCI INTENSE OUD EDP", link: "/products", image: "" }
  ];

  for (let i = 0; i < Math.min(newArrivals.length, 4); i++) {
    const p = newArrivals[i];
    items[i] = {
      title: p.title,
      description: p.description,
      link: "/products",
      image: p.images && p.images.length > 0 ? p.images[0] : ""
    };
  }

  return (
    <section className="section-width px-4 xl:px-0 py-10 mt-10">
      {/* Section Indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md"></div>
        <span className="text-[#DB4444] font-bold text-base">Featured</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">New Arrival</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
        
        {/* Left Block */}
        <div 
          className="bg-black rounded-[4px] relative h-[400px] lg:h-full group overflow-hidden flex items-end bg-cover bg-center"
          style={{ backgroundImage: items[0].image ? `url(${items[0].image})` : 'none' }}
        >
          {/* Dark overlay for text readability if there's an image */}
          {items[0].image && <div className="absolute inset-0 bg-black/30"></div>}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <h3 className="text-white text-2xl font-semibold mb-3">{items[0].title}</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-[250px] leading-relaxed line-clamp-3">
              {items[0].description}
            </p>
          </div>
        </div>

        {/* Right Blocks Container */}
        <div className="flex flex-col gap-6">
          
          {/* Top Right Block */}
          <div 
            className="bg-black rounded-[4px] relative h-[250px] lg:h-[285px] group overflow-hidden flex items-end bg-cover bg-center"
            style={{ backgroundImage: items[1].image ? `url(${items[1].image})` : 'none' }}
          >
            {items[1].image && <div className="absolute inset-0 bg-black/30"></div>}
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h3 className="text-white text-xl lg:text-2xl font-semibold mb-3">{items[1].title}</h3>
              <p className="text-gray-300 text-sm mb-4 max-w-[250px] leading-relaxed line-clamp-2">
                {items[1].description}
              </p>
            </div>
          </div>

          {/* Bottom Right Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto lg:h-[291px]">
            
            {/* Bottom Right - Left Block */}
            <div 
              className="bg-black rounded-[4px] relative h-[250px] lg:h-full group overflow-hidden flex items-end bg-cover bg-center"
              style={{ backgroundImage: items[2].image ? `url(${items[2].image})` : 'none' }}
            >
              {items[2].image && <div className="absolute inset-0 bg-black/30"></div>}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h3 className="text-white text-xl font-semibold mb-2">{items[2].title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {items[2].description}
                </p>
              </div>
            </div>

            {/* Bottom Right - Right Block */}
            <div 
              className="bg-black rounded-[4px] relative h-[250px] lg:h-full group overflow-hidden flex items-end bg-cover bg-center"
              style={{ backgroundImage: items[3].image ? `url(${items[3].image})` : 'none' }}
            >
              {items[3].image && <div className="absolute inset-0 bg-black/30"></div>}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h3 className="text-white text-xl font-semibold mb-2">{items[3].title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {items[3].description}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
