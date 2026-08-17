"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
}

interface PropertyData {
  id?: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  listingType: string;
  price: number | string;
  currency: string;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number | string;
  yearBuilt: number | string;
  description: string;
  images: string[];
  features: string[];
  featured: boolean;
  agentId: string;
}

interface PropertyFormProps {
  initialData?: Partial<PropertyData>;
  mode: "create" | "edit";
  propertyId?: string;
}

const defaultForm: PropertyData = {
  title: "",
  slug: "",
  location: "",
  type: "HOUSE",
  listingType: "SALE",
  price: "",
  currency: "USD",
  bedrooms: "",
  bathrooms: "",
  area: "",
  yearBuilt: "",
  description: "",
  images: [""],
  features: [""],
  featured: false,
  agentId: "",
};

export function PropertyForm({
  initialData,
  mode,
  propertyId,
}: PropertyFormProps) {
  const [form, setForm] = useState<PropertyData>({
    ...defaultForm,
    ...initialData,
  });

  const [agents, setAgents] = useState<Agent[]>([]);

  const [loadingAgents, setLoadingAgents] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch(
          "/api/admin/agents",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }

        const data = await response.json();

        setAgents(data);
      } catch (error) {
        console.error(
          "Failed to fetch agents:",
          error,
        );
      } finally {
        setLoadingAgents(false);
      }
    }

    fetchAgents();
  }, []);

  function updateField(
    field: keyof PropertyData,
    value: string | number | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateArrayField(
    field: "images" | "features",
    index: number,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map(
        (item, itemIndex) =>
          itemIndex === index ? value : item,
      ),
    }));
  }

  function addArrayField(
    field: "images" | "features",
  ) {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  }

  function removeArrayField(
    field: "images" | "features",
    index: number,
  ) {
    setForm((current) => {
      const values = current[field].filter(
        (_, itemIndex) => itemIndex !== index,
      );

      return {
        ...current,
        [field]: values.length > 0 ? values : [""],
      };
    });
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      ...(mode === "create"
        ? {
            slug: generateSlug(value),
          }
        : {}),
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...form,

        price: Number(form.price),

        bedrooms: Number(form.bedrooms),

        bathrooms: Number(form.bathrooms),

        area: Number(form.area),

        yearBuilt:
          form.yearBuilt === ""
            ? null
            : Number(form.yearBuilt),

        images: form.images.filter(
          (image) => image.trim(),
        ),

        features: form.features.filter(
          (feature) => feature.trim(),
        ),

        agentId: form.agentId || null,
      };

      const url =
        mode === "create"
          ? "/api/admin/properties"
          : `/api/admin/properties/${propertyId}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${
              mode === "create"
                ? "create"
                : "update"
            } property`,
        );
      }

      window.location.href =
        "/admin/properties";
    } catch (error) {
      console.error(
        "Property submission error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic information */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Basic information"
          description="The main information displayed on the property listing."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Field
            label="Property title"
            required
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Modern Hillside Villa"
          />

          <Field
            label="Slug"
            required
            value={form.slug}
            onChange={(value) =>
              updateField(
                "slug",
                generateSlug(value),
              )
            }
            placeholder="modern-hillside-villa"
          />

          <Field
            label="Location"
            required
            value={form.location}
            onChange={(value) =>
              updateField("location", value)
            }
            placeholder="Ibex Hill, Lusaka"
          />

          <SelectField
            label="Property type"
            value={form.type}
            onChange={(value) =>
              updateField("type", value)
            }
            options={[
              ["APARTMENT", "Apartment"],
              ["VILLA", "Villa"],
              ["HOUSE", "House"],
              ["COMMERCIAL", "Commercial"],
              ["LAND", "Land"],
            ]}
          />

          <SelectField
            label="Listing type"
            value={form.listingType}
            onChange={(value) =>
              updateField(
                "listingType",
                value,
              )
            }
            options={[
              ["SALE", "For Sale"],
              ["RENT", "For Rent"],
            ]}
          />

          <SelectField
            label="Currency"
            value={form.currency}
            onChange={(value) =>
              updateField("currency", value)
            }
            options={[
              ["USD", "USD"],
              ["ZMW", "ZMW"],
            ]}
          />
        </div>
      </section>

      {/* Pricing & details */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Property details"
          description="Pricing, dimensions and room information."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Price"
            required
            type="number"
            value={form.price}
            onChange={(value) =>
              updateField("price", value)
            }
            placeholder="485000"
          />

          <Field
            label="Bedrooms"
            required
            type="number"
            value={form.bedrooms}
            onChange={(value) =>
              updateField("bedrooms", value)
            }
            placeholder="4"
          />

          <Field
            label="Bathrooms"
            required
            type="number"
            value={form.bathrooms}
            onChange={(value) =>
              updateField(
                "bathrooms",
                value,
              )
            }
            placeholder="3"
          />

          <Field
            label="Area (m²)"
            required
            type="number"
            value={form.area}
            onChange={(value) =>
              updateField("area", value)
            }
            placeholder="420"
          />

          <Field
            label="Year built"
            type="number"
            value={form.yearBuilt}
            onChange={(value) =>
              updateField(
                "yearBuilt",
                value,
              )
            }
            placeholder="2024"
          />
        </div>
      </section>

      {/* Description */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Description"
          description="Describe the property and what makes it special."
        />

        <textarea
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value,
            )
          }
          rows={7}
          required
          placeholder="A beautifully designed contemporary villa..."
          className="mt-8 w-full resize-none rounded-xl border border-black/10 bg-[#f7f6f2] p-4 text-sm outline-none transition focus:border-black"
        />
      </section>

      {/* Images */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Property images"
          description="Add the image URLs used throughout the website."
        />

        <div className="mt-8 space-y-3">
          {form.images.map((image, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <input
                value={image}
                onChange={(event) =>
                  updateArrayField(
                    "images",
                    index,
                    event.target.value,
                  )
                }
                placeholder="https://images.unsplash.com/..."
                className="h-12 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  removeArrayField(
                    "images",
                    index,
                  )
                }
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            addArrayField("images")
          }
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add image
        </button>
      </section>

      {/* Features */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Features"
          description="Add amenities and features available at the property."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {form.features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <input
                value={feature}
                onChange={(event) =>
                  updateArrayField(
                    "features",
                    index,
                    event.target.value,
                  )
                }
                placeholder="Swimming Pool"
                className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  removeArrayField(
                    "features",
                    index,
                  )
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            addArrayField("features")
          }
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add feature
        </button>
      </section>

      {/* Agent */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <SectionHeading
          title="Agent"
          description="Assign this property to one of your property consultants."
        />

        <div className="mt-8">
          <label className="mb-2 block text-xs font-medium">
            Assigned agent
          </label>

          <select
            value={form.agentId}
            onChange={(event) =>
              updateField(
                "agentId",
                event.target.value,
              )
            }
            disabled={loadingAgents}
            className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none focus:border-black"
          >
            <option value="">
              {loadingAgents
                ? "Loading agents..."
                : "No agent assigned"}
            </option>

            {agents.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
              >
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Featured */}

      <section className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-sm font-medium">
              Featured property
            </h2>

            <p className="mt-1 text-sm leading-6 text-black/45">
              Featured properties appear prominently
              throughout the website.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "featured",
                !form.featured,
              )
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              form.featured
                ? "bg-black"
                : "bg-black/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                form.featured
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Submit */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <a
          href="/admin/properties"
          className="flex h-12 items-center justify-center rounded-full border border-black/10 px-6 text-sm"
        >
          Cancel
        </a>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-60"
        >
          {submitting && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create property"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-sm text-black/45">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black"
      >
        {options.map(([value, label]) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}