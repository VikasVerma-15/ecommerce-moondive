import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const TopHeader = () => {
  return (
    <div className="w-full bg-black">
      <div className="max-w-[1440px] mx-auto w-full h-[48px] text-white flex items-center justify-center text-sm">
        <div className="flex items-center gap-[231px] w-[859px] h-[24px]">
          <div className="flex items-center justify-center gap-[8px] w-[550px] h-full">
            <p className="text-center leading-[24px]">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</p>
            <Link href="/shop" className="font-semibold underline leading-[24px] hover:text-[#DB4444] transition-colors">
              ShopNow
            </Link>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 cursor-pointer h-full">
            <span>English</span>
            <ChevronDown className="h-4 w-4" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopHeader;
