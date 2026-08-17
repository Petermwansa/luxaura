"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export function Hero() {

  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  );

  useEffect(() => {
    async function fetchHeroProperty() {
      try {
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const properties = await response.json();

        const featuredProperty = properties.find(
          (property: any) => property.featured === true
        );

        if (featuredProperty?.images?.length > 0) {
          setHeroImage(featuredProperty.images[0]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch hero property:",
          error
        );
      }
    }

    fetchHeroProperty();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Luxury modern home"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/45" />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col justify-center pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/70">
            Premium Real Estate
          </p>

          <h1 className="font-display text-6xl leading-[0.88] tracking-tight sm:text-7xl md:text-8xl lg:text-[110px]">
            Find a place
            <br />
            worth calling <i>home.</i>
          </h1>

          <p className="mt-8 max-w-lg text-base leading-7 text-white/70 md:text-lg">
            Discover exceptional properties in the world&apos;s most
            desirable locations.
          </p>

          <div className="mt-10">
            <Button variant="secondary">
              Explore properties
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/60 sm:left-8 lg:left-12"
        >
          <ArrowDown size={14} />
          Scroll to explore
        </motion.div>
      </Container>
    </section>
  );
}