import { ViewTransition } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { PolaroidCarousel } from "@/components/PolaroidCarousel";
import { Section } from "@/components/Section";
import { Work } from "@/components/Work";
import { polaroids } from "@/data/portfolio";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <ViewTransition enter="page-enter" exit="page-exit" default="none">
        <div>
          <Hero />
          <Work />
          <About />
          <Contact />
          {polaroids.length > 0 ? (
            <Section id="photos" label="Off the clock" aside="click a photo">
              <PolaroidCarousel photos={polaroids} />
            </Section>
          ) : null}
        </div>
      </ViewTransition>
    </main>
  );
}
