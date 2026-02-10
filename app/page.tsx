const projects = [
  {
    title: "Full-Stack Auth App",
    description: "Built a full-stack app with authentication and protected routes.",
    tags: ["Next.js", "React", "JWT"],
    links: {
      github: "https://github.com/your-username/project",
      live: "",
    },
  },
  {
    title: "Data Dashboard",
    description: "Analyzed and visualized data to surface trends and KPIs.",
    tags: ["Python", "Pandas", "Tableau"],
    links: {
      github: "https://github.com/your-username/project",
      live: "",
    },
  },
  {
    title: "API + Database Project",
    description: "Designed REST APIs and integrated a SQL database for CRUD workflows.",
    tags: ["Node.js", "Express", "SQL"],
    links: {
      github: "https://github.com/your-username/project",
      live: "",
    },
  },
];

const skills = {
  Languages: ["JavaScript", "Python", "Java", "SQL", "HTML", "CSS"],
  Web: ["React", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
  Data: ["Tableau", "Excel", "Pandas (basic)", "NumPy (basic)"],
  Tools: ["Git", "GitHub", "VS Code"],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <header className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Arun Teja Reddy Kallam
            </h1>
            <p className="max-w-2xl text-zinc-300">
              CS student building web apps and data-driven products. Open to internships in
              Software Engineering / Data / Product.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
                href="mailto:akallam04@gmail.com"
              >
                Email
              </a>
              <a
                className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-900"
                href="https://www.linkedin.com/in/akallam3/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-900"
                href="https://github.com/akallam04"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-900"
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 sm:grid-cols-3">
            <Stat label="Location" value="Tempe, AZ" />
            <Stat label="Focus" value="Web + Data" />
            <Stat label="Status" value="Open to internships" />
          </div>
        </header>

        <main className="mt-12 space-y-12">
          <Section title="About">
            <p className="text-zinc-300">
              I’m a Computer Science student at Arizona State University. I enjoy building clean
              UIs, APIs, and data workflows that turn messy problems into shippable products.
            </p>
          </Section>

          <Section title="Skills">
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group} className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
                  <div className="text-sm font-medium text-zinc-200">{group}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{p.title}</h3>
                    <div className="flex gap-2">
                      <a
                        className="rounded-xl border border-zinc-800 px-3 py-1 text-xs hover:bg-zinc-900"
                        href={p.links.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                      {p.links.live ? (
                        <a
                          className="rounded-xl border border-zinc-800 px-3 py-1 text-xs hover:bg-zinc-900"
                          href={p.links.live}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-zinc-300">{p.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Contact">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
              <p className="text-zinc-300">
                Email:{" "}
                <a
                  className="underline decoration-zinc-500 underline-offset-4"
                  href="mailto:akallam04@gmail.com"
                >
                  akallam04@gmail.com
                </a>{" "}
                · LinkedIn preferred for quick replies.
              </p>
            </div>
          </Section>
        </main>

        <footer className="mt-16 border-t border-zinc-900 pt-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} Arun Teja Reddy Kallam
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-100">{value}</div>
    </div>
  );
}