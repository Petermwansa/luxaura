"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Phone,
  Loader2,
  Send,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] =
    useState<FormData>(initialForm);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [error, setError] = useState("");

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (status === "error") {
      setStatus("idle");
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      setStatus("error");
      setError(
        "Please complete all required fields.",
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      setStatus("error");
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    if (form.message.trim().length < 10) {
      setStatus("error");
      setError(
        "Please enter at least 10 characters in your message.",
      );
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            message: form.message.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to send your message.",
        );
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error(
        "Failed to submit contact form:",
        error,
      );

      setStatus("error");
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#f7f6f2]">
        {/* Hero */}
        <section className="bg-[#111111] pb-24 pt-36 text-white md:pb-32 md:pt-44">
          <Container>
            <div className="max-w-5xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Get in touch
              </p>

              <h1 className="font-display mt-6 text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
                Let&apos;s find
                <br />
                <i>the right place.</i>
              </h1>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/50 md:text-base md:leading-8">
                Whether you have a question about a property, want to
                schedule a viewing, or simply want to talk to us, we&apos;d
                love to hear from you.
              </p>
            </div>
          </Container>
        </section>

        {/* Contact content */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              {/* Contact information */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Contact information
                </p>

                <h2 className="font-display mt-5 text-4xl leading-tight md:text-5xl">
                  We&apos;re here
                  <br />
                  to help.
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">
                  Have a property in mind or need help finding one?
                  Reach out and a member of our team will get back to you.
                </p>

                <div className="mt-10 space-y-7">
                  <ContactDetail
                    icon={<Phone size={18} />}
                    label="Phone"
                    value="+260 97 000 0000"
                    href="tel:+260970000000"
                  />

                  <ContactDetail
                    icon={<Mail size={18} />}
                    label="Email"
                    value="hello@luxora.com"
                    href="mailto:hello@luxora.com"
                  />

                  <ContactDetail
                    icon={<MapPin size={18} />}
                    label="Location"
                    value="Lusaka, Zambia"
                  />
                </div>

                <div className="mt-12 border-t border-black/10 pt-8">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                    Office hours
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                    <p className="flex justify-between gap-6">
                      <span>Monday — Friday</span>
                      <span className="text-black">
                        08:00 — 17:00
                      </span>
                    </p>

                    <p className="flex justify-between gap-6">
                      <span>Saturday</span>
                      <span className="text-black">
                        09:00 — 13:00
                      </span>
                    </p>

                    <p className="flex justify-between gap-6">
                      <span>Sunday</span>
                      <span className="text-black/40">
                        Closed
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5 md:p-8 lg:p-10">
                {status === "success" ? (
                  <SuccessState
                    onReset={() => {
                      setStatus("idle");
                      setError("");
                    }}
                  />
                ) : (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                        Send us a message
                      </p>

                      <h2 className="font-display mt-3 text-3xl md:text-4xl">
                        How can we help?
                      </h2>
                    </div>

                    {status === "error" && (
                      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      className="mt-8 space-y-5"
                      noValidate
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <Input
                          label="Your name"
                          value={form.name}
                          onChange={(event) =>
                            updateField(
                              "name",
                              event.target.value,
                            )
                          }
                          placeholder="John Doe"
                          disabled={
                            status === "loading"
                          }
                        />

                        <Input
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField(
                              "email",
                              event.target.value,
                            )
                          }
                          placeholder="john@example.com"
                          disabled={
                            status === "loading"
                          }
                        />
                      </div>

                      <Input
                        label="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          updateField(
                            "phone",
                            event.target.value,
                          )
                        }
                        placeholder="+260 97 000 0000"
                        disabled={
                          status === "loading"
                        }
                      />

                      <div>
                        <label className="mb-2 block text-xs font-medium">
                          Message
                        </label>

                        <textarea
                          rows={6}
                          value={form.message}
                          onChange={(event) =>
                            updateField(
                              "message",
                              event.target.value,
                            )
                          }
                          placeholder="Tell us how we can help..."
                          disabled={
                            status === "loading"
                          }
                          className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f6f2] p-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={
                          status === "loading"
                        }
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send message
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs leading-5 text-black/40">
                        We&apos;ll get back to you as soon as
                        possible.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Browse properties CTA */}
        <section className="border-t border-black/10 py-20 md:py-28">
          <Container>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Still searching?
                </p>

                <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">
                  Your next place might already be waiting.
                </h2>
              </div>

              <Link
                href="/properties"
                className="group flex w-fit shrink-0 items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Browse properties

                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ---------------------------------- */
/* Contact Detail */
/* ---------------------------------- */

function ContactDetail({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-black/40">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-opacity hover:opacity-60"
      >
        {content}
      </a>
    );
  }

  return content;
}

/* ---------------------------------- */
/* Input */
/* ---------------------------------- */

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium">
        {label}
      </label>

      <input
        {...props}
        className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

/* ---------------------------------- */
/* Success State */
/* ---------------------------------- */

function SuccessState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
        <Check size={22} />
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/40">
        Message sent
      </p>

      <h2 className="font-display mt-3 text-4xl">
        Thank you.
      </h2>

      <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
        Your message has been received. A member of the Luxaura team will
        get back to you shortly.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        Send another message
      </button>
    </div>
  );
}