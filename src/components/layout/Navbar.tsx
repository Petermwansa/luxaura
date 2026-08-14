"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const links = [
  {
    label: "Properties",
    href: "/properties",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/90 text-black shadow-sm backdrop-blur-xl"
          : "bg-transparent text-white"
      }`}
    >
      <Container>
        <nav className="flex h-20 items-center justify-between md:h-24">
          <Link
            href="/"
            className={`font-display text-3xl font-semibold transition-colors ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            LUXORA
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  scrolled
                    ? "text-black/60 hover:text-black"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Button
              variant={
                scrolled ? "primary" : "secondary"
              }
              className="px-5 py-2.5"
            >
              Get in touch
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden ${
              scrolled ? "text-black" : "text-white"
            }`}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="rounded-2xl bg-white p-6 text-black shadow-xl md:hidden">
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}