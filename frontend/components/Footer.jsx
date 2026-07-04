import Link from "next/link";

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/signup" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shop", href: "/shop" },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative blurred background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#DB4444]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="section-width grid gap-8 py-[49px] sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        <div className="space-y-[15px]">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Exclusive</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Subscribe</h3>
            <p className="text-sm text-gray-400">Get 10% off your first order</p>
            <div className="flex h-12 max-w-[220px] items-center rounded-md border border-gray-700 bg-white/5 backdrop-blur-sm px-4 focus-within:border-[#DB4444] transition-colors">
              <span className="text-sm text-gray-400">Enter your email</span>
            </div>
          </div>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium mb-6">Support</h3>
          <div className="space-y-3 text-sm leading-6 text-gray-400">
            <p className="hover:text-white transition-colors cursor-pointer w-max">India ABC Colony</p>
            <p className="hover:text-white transition-colors cursor-pointer w-max">exclusive@gmail.com</p>
            <p className="hover:text-white transition-colors cursor-pointer w-max">+88015-88888-9999</p>
          </div>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium mb-6">Account</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit hover:text-[#DB4444] hover:translate-x-1 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium mb-6">Quick Link</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <p className="hover:text-[#DB4444] hover:translate-x-1 transition-all duration-300 cursor-pointer w-max">Privacy Policy</p>
            <p className="hover:text-[#DB4444] hover:translate-x-1 transition-all duration-300 cursor-pointer w-max">Terms Of Use</p>
            <p className="hover:text-[#DB4444] hover:translate-x-1 transition-all duration-300 cursor-pointer w-max">FAQ</p>
            <p className="hover:text-[#DB4444] hover:translate-x-1 transition-all duration-300 cursor-pointer w-max">Contact</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-sm text-gray-500">
        Copyright Rimel 2022. All right reserved
      </div>
    </footer>
  );
};

export default Footer;
