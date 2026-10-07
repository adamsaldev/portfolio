import { personal } from "@/data/portfolio";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="pt-8 pb-10">
      <Container>
        <div className="flex flex-col gap-3 border-t border-line pt-5 font-mono text-meta text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {personal.name}</p>
          <p className="hidden sm:block">
            Press <span className="kbd">⌘K</span> to navigate
          </p>
          <a href="#top" className="link-quiet self-start sm:self-auto">
            Back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
