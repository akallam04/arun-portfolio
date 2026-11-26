import type { MainProject } from "@/lib/data";
import type { RepoStatus } from "@/lib/github";
import { CalendarIcon } from "../icons";
import { Chip, IconLinkButton } from "../ui";
import { LiveChips } from "./LiveChips";
import { ProjectBody } from "./ProjectBody";

export function ProjectFrame({ project, status }: { project: MainProject; status?: RepoStatus }) {
  const titleId = `${project.id}-title`;
  return (
    <section id={project.id} data-page aria-labelledby={titleId} className="page">
      <div className="page-inner gap-4 desk:gap-[clamp(8px,1.6vh,24px)]">
        <header className="flex flex-col gap-3 desk:flex-row desk:items-start desk:justify-between desk:gap-8">
          <div className="min-w-0">
            <h2 id={titleId} className="display text-[clamp(38px,11vw,52px)] text-ink desk:text-[clamp(38px,7.4vh,108px)]">
              {project.name}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] desk:mt-[clamp(4px,0.9vh,12px)] desk:text-[clamp(13px,1.95vh,22px)]">
              <span className="font-bold text-accent-strong" style={{ fontStretch: "108%" }}>
                {project.subtitle}
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <CalendarIcon size={14} />
                {project.built}
              </span>
            </p>
            <p className="mt-1.5 max-w-[70ch] text-[16px] leading-snug text-ink-2 desk:mt-[clamp(3px,0.8vh,10px)] desk:text-[clamp(14px,2.05vh,24px)]">
              {project.hook}
            </p>
            {project.line ? (
              <p className="mt-1 max-w-[96ch] text-[14.5px] leading-snug text-muted desk:mt-[clamp(2px,0.5vh,8px)] desk:text-[clamp(12.5px,1.7vh,19px)]">
                {project.line}
              </p>
            ) : null}
          </div>
          <ul className="flex shrink-0 flex-wrap gap-2 desk:max-w-[44%] desk:justify-end" aria-label={`${project.name} links`}>
            {project.links.map((link) => (
              <li key={link.label}>
                <IconLinkButton href={link.href} label={link.label} icon={link.icon} srLabel={project.name} />
              </li>
            ))}
          </ul>
        </header>

        <div className="desk:min-h-0 desk:flex-1">
          <ProjectBody project={project} />
        </div>

        <footer className="flex flex-col gap-3 desk:flex-row desk:items-center desk:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label={`${project.name} is built with`}>
            {project.tech.map((item) => (
              <li key={item}>
                <Chip>{item}</Chip>
              </li>
            ))}
            {project.extra?.map((item) => (
              <li key={item}>
                <Chip className="border-accent/25 bg-sky-50/80 font-semibold text-accent-strong">{item}</Chip>
              </li>
            ))}
          </ul>
          <LiveChips status={status} label={project.name} />
        </footer>
        {project.credit ? (
          <p className="text-[13px] leading-snug text-muted desk:-mt-[clamp(2px,0.5vh,8px)] desk:text-[clamp(12px,1.5vh,16px)]">
            {project.credit}
          </p>
        ) : null}
      </div>
    </section>
  );
}
