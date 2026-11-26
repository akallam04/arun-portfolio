"use client";

import { useRef, useState, type ComponentType } from "react";
import type { MainProject, MainProjectId } from "@/lib/data";
import { useReducedMotion } from "@/lib/figure";
import { OversoldStage } from "../figures/OversoldStage";
import { ShopifyStage } from "../figures/ShopifyStage";
import { ShortfallStage } from "../figures/ShortfallStage";
import { Chip } from "../ui";
import { ProofCard } from "./ProofCard";

export type StageApi = { pick: (card: number) => void };

export type StageProps = {
  label: string;
  onLit: (card: number) => void;
  api: React.RefObject<StageApi | null>;
};

const STAGES: Record<MainProjectId, ComponentType<StageProps>> = {
  shopify: ShopifyStage,
  oversold: OversoldStage,
  shortfall: ShortfallStage,
};

export function ProjectBody({ project }: { project: MainProject }) {
  const Stage = STAGES[project.id];
  const api = useRef<StageApi | null>(null);
  const [lit, setLit] = useState(-1);
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-4 desk:h-full desk:min-h-0 desk:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] desk:gap-[clamp(12px,2vh,30px)]">
      <div className="flex min-w-0 flex-col gap-3 desk:min-h-0 desk:gap-[clamp(6px,1.2vh,16px)]">
        <div
          className="glass flex min-h-0 flex-col rounded-[26px] desk:flex-1"
          role="group"
          aria-label={project.stageLabel}
          data-tour-target
        >
          <Stage label={project.stageLabel} onLit={setLit} api={api} />
          <p className="sr-only">{project.stageSummary}</p>
        </div>
        {project.guarantees ? (
          <ul className="flex flex-wrap gap-2" aria-label="Three guarantees">
            {project.guarantees.map((item) => (
              <li key={item}>
                <Chip className="glass bg-white/55 font-semibold text-ink">{item}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <ul
        className="no-scrollbar -mx-[var(--px)] flex snap-x snap-mandatory scroll-px-[var(--px)] gap-3 overflow-x-auto px-[var(--px)] pb-1 desk:mx-0 desk:grid desk:min-h-0 desk:snap-none desk:grid-rows-3 desk:gap-[clamp(8px,1.4vh,18px)] desk:overflow-visible desk:px-0 desk:pb-0"
        aria-label={`${project.name} results`}
      >
        {project.cards.map((card, i) => (
          <li key={card.label} className="w-[80%] shrink-0 snap-start sm:w-[46%] desk:w-auto desk:min-h-0">
            <ProofCard
              card={card}
              lit={lit === i}
              onPick={reduced ? undefined : () => api.current?.pick(i)}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
