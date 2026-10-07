import { about } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

export function About() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-10">
        <Reveal className="space-y-4 text-lead text-muted md:col-span-7">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <Reveal delay={1} className="md:col-span-5">
          <h3 className="label">Technical interests</h3>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {about.interests.map((i) => (
              <div key={i.area} className="group/row py-3">
                <dt className="text-body font-medium">{i.area}</dt>
                <dd className="text-small text-muted transition-colors duration-200 group-hover/row:text-fg">
                  {i.note}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
