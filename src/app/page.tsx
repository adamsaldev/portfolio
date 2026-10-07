import { ViewTransition } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <ViewTransition enter="page-enter" exit="page-exit" default="none">
        <div>
          <Hero />
          <Work />
          <About />
          <Contact />
        </div>
      </ViewTransition>
    </main>
  );
}
