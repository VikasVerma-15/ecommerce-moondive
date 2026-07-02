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
    <footer className="mt-auto bg-black text-white">
      <div className="section-width grid gap-8 py-[49px] sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-[15px]">
          <h2 className="text-2xl font-bold tracking-tight">Exclusive</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Subscribe</h3>
            <p className="text-sm text-gray-200">Get 10% off your first order</p>
            <div className="flex h-12 max-w-[220px] items-center rounded-[4px] border border-white px-4">
              <span className="text-sm text-gray-300">Enter your email</span>
            </div>
          </div>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium">Support</h3>
          <div className="space-y-3 text-sm leading-6 text-gray-200">
            <p>India ABC Colony</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium">Account</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-200">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit hover:text-white hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-[15px]">
          <h3 className="text-xl font-medium">Quick Link</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-200">
            <p>Privacy Policy</p>
            <p>Terms Of Use</p>
            <p>FAQ</p>
            <p>Contact</p>
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
