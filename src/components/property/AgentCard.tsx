import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Agent } from "@/types/property";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="border-t border-black/10 pt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-black/40">
        Your property consultant
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="font-medium">
            {agent.name}
          </h3>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {agent.role}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center gap-3 text-[var(--muted)] transition hover:text-black"
        >
          <Phone size={15} />
          {agent.phone}
        </a>

        <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-3 text-[var(--muted)] transition hover:text-black"
        >
          <Mail size={15} />
          {agent.email}
        </a>
      </div>
    </div>
  );
}