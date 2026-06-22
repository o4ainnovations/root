import { sanityClient } from "@/lib/sanity";
import { JobCard } from "@/components/sections/job-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema, JsonLd, buildJobPostingSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { JobListing, PageContent } from "@/types";

const FALLBACK_INTRO =
  "Join O4A and help build the next generation of companies. We seek exceptional people who think in decades, not quarters.";

const FALLBACK_WHY_O4A = [
  "We believe the best companies are built over decades. At O4A, you will work on enduring problems with talented people who share a commitment to excellence and integrity.",
  "As a holding company, careers at O4A span multiple industries, business models, and stages of growth. One day you might be incubating a new venture; the next, optimizing operations at a mature subsidiary.",
];

const FALLBACK_VALUES = [
  {
    title: "Long-Term Thinking",
    desc: "We make decisions with a multi-decade horizon. Speed is good; direction is better.",
  },
  {
    title: "Ownership",
    desc: "Everyone at O4A thinks like an owner. We take responsibility for outcomes.",
  },
  {
    title: "Integrity",
    desc: "We do what we say. Trust is our most valuable asset.",
  },
  {
    title: "Excellence",
    desc: "We hold ourselves to the highest standard in everything we do.",
  },
];

const FALLBACK_STEPS = [
  "Submit your application",
  "Initial conversation with our team",
  "Deep-dive interviews with future colleagues",
  "Reference checks",
  "Offer and onboarding",
];

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "careers"][0]{body,seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Careers",
    description:
      pageContent?.seo?.metaDescription ||
      "Join O4A and help build the future. Explore open positions across our portfolio companies.",
    path: "/careers",
  });
}

export default async function CareersPage() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "careers"][0]{body,seo}`
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const rawJobs = await sanityClient.fetch<
    {
      _id: string;
      title: string;
      location: string;
      department: string;
      employmentType: string;
      subsidiary: string;
      applyUrl?: string;
      description: string;
      postedDate: string;
      slug: { current: string };
    }[]
  >(
    `*[_type == "job" && active == true] | order(postedDate desc){_id,title,location,department,employmentType,subsidiary,applyUrl,description,postedDate,slug}`
  );
  const allJobs: JobListing[] = rawJobs.map((job) => ({
    id: job._id,
    title: job.title,
    location: job.location,
    department: job.department,
    type: job.employmentType,
    subsidiary: job.subsidiary,
    url: job.applyUrl,
  }));

  const whyO4AParas = ((b.whyO4AText as string) || "")
    .split("\n\n")
    .filter(Boolean);
  const whyO4A =
    whyO4AParas.length > 0 ? whyO4AParas : FALLBACK_WHY_O4A;

  const values = [
    {
      title: (b.value1Title as string) || FALLBACK_VALUES[0].title,
      desc: (b.value1Desc as string) || FALLBACK_VALUES[0].desc,
    },
    {
      title: (b.value2Title as string) || FALLBACK_VALUES[1].title,
      desc: (b.value2Desc as string) || FALLBACK_VALUES[1].desc,
    },
    {
      title: (b.value3Title as string) || FALLBACK_VALUES[2].title,
      desc: (b.value3Desc as string) || FALLBACK_VALUES[2].desc,
    },
    {
      title: (b.value4Title as string) || FALLBACK_VALUES[3].title,
      desc: (b.value4Desc as string) || FALLBACK_VALUES[3].desc,
    },
  ];

  const stepsStr = (b.hiringSteps as string) || FALLBACK_STEPS.join("\n");
  const steps = stepsStr.split("\n").filter(Boolean);

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Careers", href: "/careers" }]} />
      {rawJobs.map((job) => (
        <JsonLd key={job._id} data={buildJobPostingSchema({
          title: job.title,
          description: job.description || "",
          datePosted: job.postedDate,
          location: job.location,
          employmentType: job.employmentType,
          url: `${COMPANY.url}/careers/jobs/${job.slug.current}`,
        })} id={`job-${job._id}`} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Careers
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            {(b.introText as string) || FALLBACK_INTRO}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                Why O4A
              </h2>
              <div className="space-y-4 font-serif text-lg leading-relaxed">
                {whyO4A.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((v) => (
                  <div key={v.title} className="card-depth-1 p-5">
                    <h3 className="font-heading text-lg font-bold text-ink">
                      {v.title}
                    </h3>
                    <p className="text-sm text-foreground mt-2">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                Open Positions
              </h2>
              {allJobs.length > 0 ? (
                <div className="space-y-4">
                  {allJobs.map((job, i) => (
                    <JobCard key={i} job={job} />
                  ))}
                </div>
              ) : (
                <div className="card-inset p-8 text-center">
                  <p className="font-serif text-muted-foreground">
                    No open positions at this time. Follow us for future
                    opportunities.
                  </p>
                </div>
              )}
            </section>
          </ScrollReveal>
        </div>

        <aside className="space-y-6">
          <div className="card-depth-1 p-6 sticky top-24">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              {(b.hiringTitle as string) || "How We Hire"}
            </h4>
            <ol className="space-y-3 font-serif text-sm text-foreground list-decimal list-inside">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
