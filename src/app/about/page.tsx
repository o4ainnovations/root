import { sanityFetch, sanityClient } from "@/lib/sanity";
import { TeamCard } from "@/components/sections/team-card";
import { Timeline } from "@/components/sections/timeline";
import { StatCounter } from "@/components/sections/stat-counter";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, JsonLd, buildCorporationSchema, buildPersonSchema, BreadcrumbSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import { urlFor } from "@/lib/sanity";
import type { TeamMember } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<{ seo?: { metaTitle?: string; metaDescription?: string } }>(
    `*[_type == "pageContent" && slug.current == "about"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "About",
    description: pageContent?.seo?.metaDescription || "Learn about O4A — our mission, governance, and leadership.",
    path: "/about",
  });
}

const TEAM_QUERY = `*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  title,
  bio,
  photo,
  type,
  order
}`;

const fallbackTimeline = [
  {
    year: "2026",
    title: "O4A Founded",
    description:
      "O4A was established as a holding company to build, operate, and invest in transformative businesses across technology, media, and services.",
  },
];

const defaultMissionText = `O4A exists to build, operate, and invest in businesses that solve meaningful problems. We are a holding company that provides capital, operational expertise, and strategic guidance to our portfolio companies, allowing them to focus on what they do best.

Our approach is patient and long-term. We do not flip companies — we build them. We invest in exceptional teams, provide the resources they need to succeed, and maintain ownership over decades, not quarters.

Integrity, operational excellence, and a relentless focus on creating value define everything we do.`;

export default async function AboutPage() {
  const pageContent = await sanityClient.fetch(
    '*[_type == "pageContent" && slug.current == "about"][0]{body,seo}'
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const members = await sanityFetch<TeamMember[]>({
    query: TEAM_QUERY,
    tags: ["teamMember"],
  });

  const executives = members.filter((m) => m.type === "executive");
  const board = members.filter((m) => m.type === "board");

  const timelineEvents = ((b.timelineYear && b.timelineTitle && b.timelineDesc)
    ? [{ year: b.timelineYear as string, title: b.timelineTitle as string, description: b.timelineDesc as string }]
    : fallbackTimeline);

  const stats = [
    { value: 1, label: "Subsidiaries" },
    { value: 5, label: "Active Projects" },
    { value: (b.foundedYear as number) || 2026, label: "Founded" },
    { value: 3, label: "Industries" },
  ];

  return (
    <>
      <JsonLd data={buildCorporationSchema()} id="corporation" />
      <BreadcrumbSchema items={[{ name: "About", href: "/about" }]} />
      {executives.map((m) => (
        <JsonLd key={m._id} data={buildPersonSchema({
          name: m.name,
          jobTitle: m.title,
          description: m.bio || "",
          imageUrl: m.photo ? urlFor(m.photo).url() : undefined,
          url: `${COMPANY.url}/about`,
        })} id={`person-${m._id}`} />
      ))}
      {board.map((m) => (
        <JsonLd key={m._id} data={buildPersonSchema({
          name: m.name,
          jobTitle: m.title,
          description: m.bio || "",
          imageUrl: m.photo ? urlFor(m.photo).url() : undefined,
          url: `${COMPANY.url}/about`,
        })} id={`person-${m._id}`} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            About O4A
          </h1>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                Mission &amp; Values
              </h2>
              <div className="drop-cap font-serif text-lg leading-relaxed space-y-4">
                <p style={{ whiteSpace: 'pre-line' }}>
                  {(b.missionText as string) || defaultMissionText}
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                History
              </h2>
              <Timeline events={timelineEvents} />
            </section>
          </ScrollReveal>

          {executives.length > 0 && (
            <ScrollReveal>
              <section>
                <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                  Leadership
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {executives.map((member) => (
                    <TeamCard key={member._id} member={member} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {board.length > 0 && (
            <ScrollReveal>
              <section>
                <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                  Board of Directors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {board.map((member) => (
                    <TeamCard key={member._id} member={member} />
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card-depth-1 p-6 sticky top-24">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Key Figures
            </h4>
            <dl className="space-y-3">
              <div>
                <dt className="label-uppercase">Founded</dt>
                <dd className="font-serif text-foreground">{(b.foundedYear as string) || "2026"}</dd>
              </div>
              <div>
                <dt className="label-uppercase mt-2">Headquarters</dt>
                <dd className="font-serif text-foreground">
                  {(b.headquarters as string) || "United Kingdom"}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-2">Structure</dt>
                <dd className="font-serif text-foreground">
                  {(b.structure as string) || "Private Holding Company"}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <ScrollReveal>
        <section className="mt-16">
          <StatCounter stats={stats} />
        </section>
      </ScrollReveal>
    </div>
    </>
  );
}
