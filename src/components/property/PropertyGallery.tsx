"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black sm:aspect-[16/9] md:aspect-[16/8]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{
                opacity: 0,
                scale: 1.02,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImage]}
                alt={`${title} - image ${
                  activeImage + 1
                }`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 pt-24">
            <span className="text-xs text-white/80">
              {activeImage + 1} / {images.length}
            </span>

            <button
              onClick={() => setLightboxOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition hover:scale-105 hover:bg-white"
              aria-label="Open fullscreen gallery"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <GalleryButton
                direction="left"
                onClick={previousImage}
              />

              <GalleryButton
                direction="right"
                onClick={nextImage}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image}
              onClick={() => setActiveImage(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                activeImage === index
                  ? "ring-2 ring-black ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${
                  index + 1
                }`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 p-4 md:p-8"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black"
              aria-label="Close gallery"
            >
              <X size={19} />
            </button>

            <div className="relative flex h-full w-full items-center justify-center">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-[75vh] w-full max-w-6xl"
              >
                <Image
                  src={images[activeImage]}
                  alt={`${title} - image ${
                    activeImage + 1
                  }`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black md:left-5"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black md:right-5"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeImage
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to image ${
                    index + 1
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 transition group-hover:opacity-100 ${
        direction === "left"
          ? "left-4"
          : "right-4"
      }`}
      aria-label={
        direction === "left"
          ? "Previous image"
          : "Next image"
      }
    >
      {direction === "left" ? (
        <ChevronLeft size={19} />
      ) : (
        <ChevronRight size={19} />
      )}
    </button>
  );
}