import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { Comparison } from "./sections/Comparison";
import { SkillsExplorer } from "./sections/SkillsExplorer";
import { ToolingPipeline } from "./sections/ToolingPipeline";
import { Roadmap } from "./sections/Roadmap";
import { Readiness } from "./sections/Readiness";
import { Footer } from "./sections/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Comparison />
        <SkillsExplorer />
        <ToolingPipeline />
        <Roadmap />
        <Readiness />
      </main>
      <Footer />
    </>
  );
}
