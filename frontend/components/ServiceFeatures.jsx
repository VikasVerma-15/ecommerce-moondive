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
    <section className="section-width px-4 xl:px-0 py-20 mt-10 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#2F2E30] bg-opacity-30 rounded-full flex items-center justify-center mb-6">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                  <Icon size={28} className="text-white stroke-[1.5]" />
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-wide text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
