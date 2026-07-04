import { Truck, Headphones, ShieldCheck } from 'lucide-react';

export default function ServiceFeatures() {
  const features = [
    {
      icon: Truck,
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140"
    },
    {
      icon: Headphones,
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support"
    },
    {
      icon: ShieldCheck,
      title: "MONEY BACK GUARANTEE",
      description: "We reurn money within 30 days"
    }
  ];

  return (
    <section className="section-width px-4 xl:px-0 py-6 border-t border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center group cursor-pointer p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
              <div className="w-20 h-20 bg-gray-300/50 rounded-full flex items-center justify-center mb-6 group-hover:-translate-y-3 transition-transform duration-500">
                <div className="w-14 h-14 bg-black group-hover:bg-[#DB4444] rounded-full flex items-center justify-center transition-colors duration-500 shadow-lg">
                  <Icon size={28} className="text-white stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-wide text-gray-900 mb-2 group-hover:text-[#DB4444] transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
