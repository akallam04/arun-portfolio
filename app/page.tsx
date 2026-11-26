import { SiteShell } from "@/components/site/SiteShell";
import { HomePage } from "@/components/pages/HomePage";
import { AboutPage } from "@/components/pages/AboutPage";
import { MoreProjectsPage } from "@/components/pages/MoreProjectsPage";
import { ExperiencePage } from "@/components/pages/ExperiencePage";
import { EducationPage } from "@/components/pages/EducationPage";
import { SkillsPage } from "@/components/pages/SkillsPage";
import { GitHubPage } from "@/components/pages/GitHubPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { ProjectFrame } from "@/components/project/ProjectFrame";
import { OVERSOLD, SHOPIFY, SHORTFALL } from "@/lib/data";
import { getGitHubData } from "@/lib/github";

export default async function Page() {
  const github = await getGitHubData();
  const agentEnabled = Boolean(process.env.ANTHROPIC_API_KEY);
  return (
    <SiteShell agentEnabled={agentEnabled}>
      <main id="main" tabIndex={-1}>
        <HomePage />
        <AboutPage />
        <ProjectFrame project={SHOPIFY} status={github.main[SHOPIFY.repo]} />
        <ProjectFrame project={OVERSOLD} status={github.main[OVERSOLD.repo]} />
        <ProjectFrame project={SHORTFALL} status={github.main[SHORTFALL.repo]} />
        <MoreProjectsPage pushed={github.pushed} external={github.external ?? {}} />
        <ExperiencePage />
        <EducationPage />
        <SkillsPage />
        <GitHubPage data={github} />
        <ContactPage />
      </main>
    </SiteShell>
  );
}
