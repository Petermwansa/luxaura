import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/sections/Hero";
import { PropertySearch } from "@/components/sections/PropertySearch";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PropertySearch />
        <FeaturedProperties />
        <About />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}