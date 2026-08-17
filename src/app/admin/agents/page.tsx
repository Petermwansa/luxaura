"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Edit,
  Mail,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Container } from "@/components/ui/Container";

interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  image?: string | null;
  properties?: {
    id: string;
  }[];
  _count?: {
    properties: number;
  };
}

interface AgentForm {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

const initialForm: AgentForm = {
  name: "",
  role: "",
  phone: "",
  email: "",
  image: "",
};

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] =
    useState<Agent | null>(null);

  const [form, setForm] = useState<AgentForm>(initialForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/agents");

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();

      setAgents(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load agents.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingAgent(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(agent: Agent) {
    setEditingAgent(agent);

    setForm({
      name: agent.name,
      role: agent.role,
      phone: agent.phone,
      email: agent.email,
      image: agent.image ?? "",
    });

    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingAgent(null);
    setForm(initialForm);
    setError("");
  }

  function updateField(
    field: keyof AgentForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.role.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingAgent
        ? `/api/admin/agents/${editingAgent.id}`
        : "/api/admin/agents";

      const method = editingAgent ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save agent",
        );
      }

      if (editingAgent) {
        setAgents((current) =>
          current.map((agent) =>
            agent.id === editingAgent.id
              ? data
              : agent,
          ),
        );
      } else {
        setAgents((current) => [
          data,
          ...current,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteAgent(agent: Agent) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${agent.name}?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/agents/${agent.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete agent",
        );
      }

      setAgents((current) =>
        current.filter(
          (item) => item.id !== agent.id,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete agent.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <Container className="py-10 md:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              Administration
            </p>

            <h1 className="font-display mt-3 text-5xl md:text-6xl">
              Agents
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Manage the property consultants and agents
              responsible for your listings.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm text-white transition hover:bg-black/80"
          >
            <Plus size={17} />
            Add agent
          </button>
        </div>

        {/* Error */}
        {error && !modalOpen && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-black/40">
              Total agents
            </p>

            <p className="font-display mt-3 text-4xl">
              {loading ? "—" : agents.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-black/40">
              Active agents
            </p>

            <p className="font-display mt-3 text-4xl">
              {loading ? "—" : agents.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-black/40">
              Properties managed
            </p>

            <p className="font-display mt-3 text-4xl">
              {loading
                ? "—"
                : agents.reduce(
                    (total, agent) =>
                      total +
                      (agent._count?.properties ??
                        agent.properties?.length ??
                        0),
                    0,
                  )}
            </p>
          </div>
        </div>

        {/* Agents */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-6"
              >
                <div className="h-20 w-20 rounded-full bg-black/10" />

                <div className="mt-5 h-5 w-2/3 rounded bg-black/10" />

                <div className="mt-3 h-4 w-1/2 rounded bg-black/10" />

                <div className="mt-6 h-4 w-full rounded bg-black/10" />

                <div className="mt-3 h-4 w-4/5 rounded bg-black/10" />
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
              <UserRound size={25} />
            </div>

            <h2 className="font-display mt-6 text-3xl">
              No agents yet
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Add your first property consultant to
              start assigning agents to properties.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Add your first agent
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const propertyCount =
                agent._count?.properties ??
                agent.properties?.length ??
                0;

              return (
                <article
                  key={agent.id}
                  className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                >
                  <div className="flex items-start justify-between">
                    {agent.image ? (
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
                        <UserRound
                          size={28}
                          className="text-black/40"
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          openEditModal(agent)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white"
                        title="Edit agent"
                      >
                        <Edit size={15} />
                      </button>

                      <button
                        onClick={() =>
                          deleteAgent(agent)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-red-500 transition hover:bg-red-500 hover:text-white"
                        title="Delete agent"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="font-display text-2xl">
                      {agent.name}
                    </h2>

                    <p className="mt-1 text-sm text-black/50">
                      {agent.role}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-black/10 pt-5">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail
                        size={15}
                        className="text-black/40"
                      />

                      <span className="truncate">
                        {agent.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Phone
                        size={15}
                        className="text-black/40"
                      />

                      <span>{agent.phone}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
                    <span className="text-xs uppercase tracking-widest text-black/40">
                      Properties
                    </span>

                    <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                      {propertyCount}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-black/40">
                  {editingAgent
                    ? "Edit agent"
                    : "New agent"}
                </p>

                <h2 className="font-display mt-1 text-2xl">
                  {editingAgent
                    ? "Update agent"
                    : "Add agent"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <FormInput
                label="Full name"
                value={form.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value,
                  )
                }
                placeholder="Amanda Mwila"
              />

              <FormInput
                label="Role"
                value={form.role}
                onChange={(e) =>
                  updateField(
                    "role",
                    e.target.value,
                  )
                }
                placeholder="Senior Property Consultant"
              />

              <FormInput
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value,
                  )
                }
                placeholder="+260 97 000 0000"
              />

              <FormInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value,
                  )
                }
                placeholder="agent@luxora.com"
              />

              <FormInput
                label="Profile image URL"
                value={form.image}
                onChange={(e) =>
                  updateField(
                    "image",
                    e.target.value,
                  )
                }
                placeholder="https://..."
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl border border-black/10 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 flex-1 rounded-xl bg-black text-sm text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingAgent
                      ? "Save changes"
                      : "Create agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function FormInput({
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
        className="h-12 w-full rounded-xl border border-black/10 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}