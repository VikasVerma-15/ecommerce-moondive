"use client";

import { usePathname } from "next/navigation";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide TopHeader and Navbar on any admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  return (
    <>
      <TopHeader />
      <Navbar />
    </>
  );
}
