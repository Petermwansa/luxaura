"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  AlertCircle,
  Check,
  Heart,
  Loader2,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

interface EnquiryCardProps {
  /**
   * IMPORTANT:
   * This must be the MongoDB/Prisma property ID,
   * NOT the property slug.
   *
   * Example:
   * "68a123456789abcdef123456"
   *
   * NOT:
   * "modern-hillside-villa"
   */
  propertyId: string;
  propertyTitle: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  message?: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  date: "",
  message: "",
};

export function EnquiryCard({
  propertyId,
  propertyTitle,
}: EnquiryCardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  const [saved, setSaved] = useState(false);
  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const [form, setForm] =
    useState<FormData>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  /*
   * Check if this property is already
   * saved by the current user.
   */
  useEffect(() => {
    async function checkFavorite() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setSaved(false);
        return;
      }

      try {
        const response = await fetch(
          "/api/favorites",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          console.error(
            "Failed to fetch favorites.",
          );
          return;
        }

        const data = await response.json();

        const favorites =
          data.favorites ?? data;

        const isFavorite = favorites.some(
          (favorite: {
            propertyId?: string;
            property?: {
              id?: string;
            };
          }) => {
            return (
              favorite.propertyId ===
                propertyId ||
              favorite.property?.id ===
                propertyId
            );
          },
        );

        setSaved(isFavorite);
      } catch (error) {
        console.error(
          "Failed to check favorite:",
          error,
        );
      }
    }

    checkFavorite();
  }, [
    isLoaded,
    isSignedIn,
    propertyId,
  ]);

  /*
   * Add/remove favorite.
   */
  async function handleFavorite() {
    if (!isLoaded) {
      return;
    }

    /*
     * User must be signed in.
     */
    if (!isSignedIn) {
      const redirectUrl =
        `${window.location.pathname}` +
        `${window.location.search}`;

      window.location.href =
        `/sign-in?redirect_url=${encodeURIComponent(
          redirectUrl,
        )}`;

      return;
    }

    /*
     * Prevent duplicate requests.
     */
    if (favoriteLoading) {
      return;
    }

    /*
     * Make sure we actually have a property ID.
     */
    if (!propertyId) {
      console.error(
        "Cannot update favorite: propertyId is missing.",
      );
      return;
    }

    setFavoriteLoading(true);

    try {
      /*
       * REMOVE FAVORITE
       */
      if (saved) {
        const response = await fetch(
          `/api/favorites/${propertyId}`,
          {
            method: "DELETE",
          },
        );

        const data =
          await response.json().catch(
            () => null,
          );

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to remove favorite.",
          );
        }

        setSaved(false);
      }

      /*
       * ADD FAVORITE
       */
      else {
        const response = await fetch(
          "/api/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              propertyId,
            }),
          },
        );

        const data =
          await response.json().catch(
            () => null,
          );

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to add favorite.",
          );
        }

        setSaved(true);
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error,
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  /*
   * Update form fields.
   */
  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    if (status === "error") {
      setStatus("idle");
    }
  }

  /*
   * Validate enquiry form.
   */
  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Please enter your name.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Please enter your phone number.";
    }

    if (!form.date) {
      newErrors.date =
        "Please select a preferred date.";
    } else {
      const selectedDate = new Date(
        form.date,
      );

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date =
          "Please select a future date.";
      }
    }

    if (!form.message.trim()) {
      newErrors.message =
        "Please tell us how we can help.";
    } else if (
      form.message.trim().length < 10
    ) {
      newErrors.message =
        "Please enter at least 10 characters.";
    }

    return newErrors;
  }

  /*
   * Submit enquiry.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        "/api/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            date: form.date,
            message:
              form.message.trim(),
            propertyId,
          }),
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Failed to submit enquiry.",
        );
      }

      setStatus("success");
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error(
        "Failed to submit enquiry:",
        error,
      );

      setStatus("error");
    }
  }

  /*
   * SUCCESS STATE
   */
  if (status === "success") {
    return (
      <aside className="rounded-2xl bg-white p-7 shadow-xl shadow-black/5">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
            <Check size={22} />
          </div>

          <h2 className="font-display mt-6 text-3xl">
            Request received
          </h2>

          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Thank you for your interest in{" "}
            {propertyTitle}. Our property
            consultant will contact you
            shortly.
          </p>

          <button
            type="button"
            onClick={() =>
              setStatus("idle")
            }
            className="mt-7 text-sm underline underline-offset-4"
          >
            Send another enquiry
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5 md:p-7">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-black/40">
            Interested?
          </p>

          <h2 className="font-display mt-2 text-3xl">
            Schedule a viewing
          </h2>
        </div>

        {/* FAVORITE BUTTON */}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={
            favoriteLoading ||
            !isLoaded
          }
          aria-label={
            saved
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={saved}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
            saved
              ? "border-black bg-black text-white"
              : "border-black/10 hover:border-black"
          } ${
            favoriteLoading ||
            !isLoaded
              ? "cursor-not-allowed opacity-60"
              : ""
          }`}
        >
          {favoriteLoading ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Heart
              size={17}
              fill={
                saved
                  ? "currentColor"
                  : "none"
              }
            />
          )}
        </button>
      </div>

      {/* ERROR */}
      {status === "error" && (
        <div className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="shrink-0"
          />

          <p>
            Something went wrong while
            sending your request. Please
            try again.
          </p>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
        noValidate
      >
        <Input
          label="Your name"
          value={form.name}
          onChange={(e) =>
            updateField(
              "name",
              e.target.value,
            )
          }
          error={errors.name}
          placeholder="John Doe"
          disabled={
            status === "loading"
          }
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            updateField(
              "email",
              e.target.value,
            )
          }
          error={errors.email}
          placeholder="john@example.com"
          disabled={
            status === "loading"
          }
        />

        <Input
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) =>
            updateField(
              "phone",
              e.target.value,
            )
          }
          error={errors.phone}
          placeholder="+260 97 000 0000"
          disabled={
            status === "loading"
          }
        />

        <Input
          label="Preferred date"
          type="date"
          value={form.date}
          onChange={(e) =>
            updateField(
              "date",
              e.target.value,
            )
          }
          error={errors.date}
          disabled={
            status === "loading"
          }
        />

        <div>
          <label className="mb-2 block text-xs font-medium">
            Message
          </label>

          <textarea
            rows={4}
            value={form.message}
            onChange={(e) =>
              updateField(
                "message",
                e.target.value,
              )
            }
            placeholder="I'm interested in viewing this property..."
            disabled={
              status === "loading"
            }
            className={`w-full resize-none rounded-xl border bg-[#f7f6f2] p-4 text-sm outline-none transition focus:border-black ${
              errors.message
                ? "border-red-400"
                : "border-black/10"
            }`}
          />

          {errors.message && (
            <ErrorMessage>
              {errors.message}
            </ErrorMessage>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            status === "loading"
          }
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
              Request a viewing
            </>
          )}
        </Button>
      </form>
    </aside>
  );
}

/*
 * INPUT
 */
function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium">
        {label}
      </label>

      <input
        {...props}
        className={`h-12 w-full rounded-xl border bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-400"
            : "border-black/10"
        }`}
      />

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}

/*
 * ERROR MESSAGE
 */
function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-1.5 text-xs text-red-600">
      {children}
    </p>
  );
}