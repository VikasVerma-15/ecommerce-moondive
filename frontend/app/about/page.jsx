"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  Headphones,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react";

const Twitter = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const Linkedin = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

const stats = [
  {
    icon: Store,
    value: "10.5k",
    label: "Sellers active our site",
  },
  {
    icon: BadgeDollarSign,
    value: "33k",
    label: "Monthly Product Sale",
  },
  {
    icon: ShoppingBag,
    value: "45.5k",
    label: "Customer active in our site",
  },
  {
    icon: BadgeDollarSign,
    value: "25k",
    label: "Annual gross sale in our site",
  },
];

const team = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: "/images/about-team-tom.svg",
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    image: "/images/about-team-emma.svg",
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    image: "/images/about-team-will.svg",
  },
  {
    name: "John Doe",
    role: "Lead Developer",
    image: "/images/about-team-tom.svg",
  },
  {
    name: "Jane Doe",
    role: "Marketing Head",
    image: "/images/about-team-emma.svg",
  },
];

const services = [
  {
    icon: PackageCheck,
    title: "FREE AND FAST DELIVERY",
    text: "Free delivery for all orders over $140",
  },
  {
    icon: Headphones,
    title: "24/7 CUSTOMER SERVICE",
    text: "Friendly 24/7 customer support",
  },
  {
    icon: ShieldCheck,
    title: "MONEY BACK GUARANTEE",
    text: "We return money within 30 days",
  },
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideWidth = 100 / itemsPerSlide;
  const maxSlide = Math.max(0, team.length - itemsPerSlide);
  const visibleSlide = Math.min(currentSlide, maxSlide);

  return (
    <main className="section-width flex flex-col gap-10 py-8 overflow-hidden">
      <div className="text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-3">/</span>
        <span className="text-gray-900">About</span>
      </div>

      <section className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-[525px] space-y-8">
          <h1 
            className="text-justify font-semibold text-[54px] leading-[64px] tracking-[0.06em]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Our Story
          </h1>
          <div className="space-y-5 text-black">
            <p 
              className="text-[16px] font-normal leading-[26px] tracking-[0em]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Launced in 2015, Exclusive is South Asia&apos;s premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
            </p>
            <p 
              className="text-[16px] font-normal leading-[26px] tracking-[0em]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-xl flex items-center justify-center">
          <Image
            src="/images/about-side-image.svg"
            alt="Two shoppers holding bags"
            width={705}
            height={609}
            className="h-auto w-full rounded-2xl"
            priority
          />
        </div>
      </section>

      <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white text-black text-center transition-all duration-300 hover:border-[#db4444] hover:bg-[#db4444] hover:text-white shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <span
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 transition-colors group-hover:bg-white/30"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-colors group-hover:bg-white group-hover:text-black"
                >
                  <Icon className="h-6 w-6" />
                </span>
              </span>
              <strong className="text-3xl font-bold">{item.value}</strong>
              <span className="mt-2 text-sm">{item.label}</span>
            </div>
          );
        })}
      </section>

      <section className="space-y-10">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out -mx-4"
            style={{ 
              transform: `translateX(-${visibleSlide * slideWidth}%)`, 
            }}
          >
            {team.map((member, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4 md:w-1/3">
                <article className="group cursor-pointer">
                  <div className="mb-6 overflow-hidden bg-[#f5f5f5] rounded-2xl shadow-sm group-hover:shadow-lg transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={370}
                      height={430}
                      className="h-auto w-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h2 className="text-2xl font-medium">{member.name}</h2>
                  <p className="mt-2 text-sm">{member.role}</p>
                  <div className="mt-4 flex gap-4">
                    <Twitter className="h-5 w-5 cursor-pointer hover:text-[#db4444] transition-colors" />
                    <Instagram className="h-5 w-5 cursor-pointer hover:text-[#db4444] transition-colors" />
                    <Linkedin className="h-5 w-5 cursor-pointer hover:text-[#db4444] transition-colors" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {Array.from({ length: maxSlide + 1 }).map((_, dot) => (
            <button
              key={dot}
              onClick={() => setCurrentSlide(dot)}
              className={`h-3 w-3 rounded-full transition-colors ${
                visibleSlide === dot ? "border-2 border-white bg-[#db4444] ring-2 ring-gray-400" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-10 pb-8 text-center md:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div key={service.title} className="flex flex-col items-center group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 group-hover:bg-[#db4444]/20 transition-colors duration-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white group-hover:bg-[#db4444] group-hover:scale-110 shadow-md transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </span>
              </span>
              <h3 className="text-base font-semibold">{service.title}</h3>
              <p className="mt-2 text-xs">{service.text}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
