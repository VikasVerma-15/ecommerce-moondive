import FlashSales from "@/components/FlashSales";
import CategoryBrowse from "@/components/CategoryBrowse";
import BestSelling from "@/components/BestSelling";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrival from "@/components/NewArrival";
import ServiceFeatures from "@/components/ServiceFeatures";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col bg-white">
      <HeroSection/>
      <FlashSales />
      <CategoryBrowse />
      <BestSelling />
      <ExploreProducts />
      <NewArrival />
      <ServiceFeatures />
    </main>
  );
}
