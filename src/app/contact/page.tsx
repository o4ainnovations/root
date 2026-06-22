import { sanityClient } from "@/lib/sanity";
import { ContactForm } from "@/components/sections/contact-form";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<{ seo?: { metaTitle?: string; metaDescription?: string } }>(
    `*[_type == "pageContent" && slug.current == "contact"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Contact",
    description: pageContent?.seo?.metaDescription || "Get in touch with O4A. For media, investor, partnership, and general inquiries.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const pageContent = await sanityClient.fetch(
    '*[_type == "pageContent" && slug.current == "contact"][0]{body,seo}'
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Contact", href: "/contact" }]} />
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Contact
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            {(b.introText as string) || "Select the appropriate category below. We respond to all inquiries within 2 business days."}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <ScrollReveal>
            <div className="card-depth-2 p-8">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>

        <aside className="space-y-6">
          <div className="card-depth-1 p-6">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Direct Contact
            </h4>
            <dl className="space-y-4">
              <div>
                <dt className="label-uppercase">General</dt>
                <dd className="font-serif text-foreground mt-1">
                  {(b.generalEmail as string) || COMPANY.contact.general}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-3">Press</dt>
                <dd className="font-serif text-foreground mt-1">
                  {(b.pressEmail as string) || COMPANY.contact.press}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-3">Investors</dt>
                <dd className="font-serif text-foreground mt-1">
                  {(b.investorsEmail as string) || COMPANY.contact.investors}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-3">Partnerships</dt>
                <dd className="font-serif text-foreground mt-1">
                  {(b.partnershipsEmail as string) || COMPANY.contact.partnerships}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-depth-1 p-6">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Office
            </h4>
            <p className="font-serif text-foreground text-sm leading-relaxed">
              {(b.officeLocation as string) || "United Kingdom"}
            </p>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
