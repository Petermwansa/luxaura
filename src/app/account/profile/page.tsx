"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  image: string | null;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load profile from our database
   */
  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/account/profile",
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Failed to fetch profile.",
          );
        }

        setProfile({
          name: data.user.name ?? "",
          email: data.user.email ?? "",
          phone: data.user.phone ?? "",
          image:
            data.user.image ??
            user.imageUrl ??
            null,
        });
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isLoaded, user]);

  /*
   * Update a field
   */
  function updateField(
    field: keyof ProfileData,
    value: string,
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess(false);
    setError("");
  }

  /*
   * Save profile
   */
  async function handleSave(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!profile.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch(
        "/api/account/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            phone: profile.phone.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to update profile.",
        );
      }

      setProfile((current) => ({
        ...current,
        name: data.user.name ?? current.name,
        phone: data.user.phone ?? "",
      }));

      setSuccess(true);

      /*
       * Remove the success message after a few seconds.
       */
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Wait for Clerk
   */
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f7f6f2]">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            size={24}
            className="animate-spin"
          />
        </div>
      </main>
    );
  }

  /*
   * User is not signed in
   */
  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f6f2]">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5 text-center">
          <div>
            <h1 className="font-display text-4xl">
              Sign in required
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Please sign in to manage your
              profile.
            </p>

            <Link
              href="/sign-in"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName =
    profile.name ||
    user.fullName ||
    user.username ||
    "User";

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-16">
        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to account
        </Link>

        {/* Header */}
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">
            Account
          </p>

          <h1 className="font-display mt-3 text-5xl tracking-tight md:text-6xl">
            Your profile
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
            Manage your personal information
            and contact details.
          </p>
        </div>

        {/* Profile card */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-xl shadow-black/5 md:p-8">
          {/* Avatar */}
          <div className="flex items-center gap-5 border-b border-black/10 pb-7">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={displayName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl text-white">
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-2xl">
                {displayName}
              </h2>

              <p className="mt-1 text-sm text-black/50">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2
                size={24}
                className="animate-spin"
              />
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="mt-8 space-y-6"
            >
              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <Check size={17} />
                  Profile updated successfully.
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="Peter Mwansa"
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-black/10 bg-black/5 px-4 text-sm text-black/50"
                />

                <p className="mt-2 text-xs text-black/40">
                  Your email address is managed
                  through your account.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-medium"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                  placeholder="+260 97 000 0000"
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Save */}
              <div className="flex justify-end border-t border-black/10 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}