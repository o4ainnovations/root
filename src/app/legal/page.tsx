import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Legal & Governance",
  description: "Privacy policy, terms of service, and legal information for O4A.",
  path: "/legal",
  robots: { index: false, follow: true },
});

const sections = [
  {
    id: "privacy",
    title: "Privacy Policy",
    effective: "Effective: January 2024",
    content: `O4A Innovations ("O4A", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website o4ainnovations.com.

We collect minimal information — only what you voluntarily provide through our contact form (name, email, subject, message). We do not use cookies for tracking purposes and do not sell or share your personal data with third parties.

Your information is stored securely with our service providers (Formspree for form submissions, Google Analytics for anonymized analytics) and is used solely to respond to your inquiry or improve our website experience.

You may request deletion of your data at any time by contacting us.`,
  },
  {
    id: "terms",
    title: "Terms of Service",
    effective: "Effective: January 2024",
    content: `By accessing and using o4ainnovations.com, you accept and agree to be bound by these Terms of Service. If you do not agree, you must not use this website.

This website and its content are owned by O4A. All content, trademarks, logos, and intellectual property displayed are the property of O4A or its subsidiaries.

The information on this website is provided for general informational purposes only. O4A makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the website or the information contained on it.

O4A shall not be liable for any loss or damage arising from the use of this website. Links to external websites are provided for convenience only; O4A does not endorse or assume responsibility for third-party content.`,
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    effective: "Effective: January 2024",
    content: `Our website uses minimal cookies. Google Analytics uses anonymized cookies for basic traffic analysis. No advertising cookies, tracking cookies, or third-party cookies are set by our domain.

By using our website, you consent to the placement of these essential cookies. You can disable cookies in your browser settings, though this may affect the functionality of certain parts of the website.`,
  },
  {
    id: "gdpr",
    title: "GDPR Compliance",
    effective: "Effective: January 2024",
    content: `O4A is committed to compliance with the General Data Protection Regulation (GDPR). For users in the European Economic Area (EEA), you have the right to:

• Access your personal data
• Rectify inaccurate personal data
• Request deletion of your personal data
• Restrict or object to processing of your personal data
• Data portability

To exercise any of these rights, contact us at the email addresses listed on our Contact page. We will respond within 30 days.`,
  },
  {
    id: "whistleblower",
    title: "Whistleblower Policy",
    effective: "Effective: January 2024",
    content: `O4A is committed to maintaining the highest standards of ethical conduct and integrity. We encourage employees, partners, and stakeholders to report any suspected violations of law, regulation, or company policy.

Reports can be made anonymously and will be treated confidentially. O4A prohibits retaliation against any individual who reports concerns in good faith.

To report a concern, contact our legal department at the address listed on our Contact page.`,
  },
];

export default function LegalPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Legal & Governance", href: "/legal" }]} />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Legal &amp; Governance
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed">
            Our legal policies, terms, and compliance documents.
          </p>
        </div>
      </ScrollReveal>

      <nav className="mb-12 border border-border p-6">
        <h4 className="font-heading text-lg font-bold text-ink mb-3">
          On this page
        </h4>
        <ul className="space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="nav-link text-xs text-ink hover:text-gold transition-colors"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-16">
        {sections.map((s) => (
          <ScrollReveal key={s.id}>
            <section id={s.id}>
              <h2 className="font-heading text-2xl font-bold text-ink mb-2 border-b border-hairline pb-3">
                {s.title}
              </h2>
              <p className="label-uppercase mb-4">{s.effective}</p>
              <div className="font-serif text-lg leading-relaxed whitespace-pre-line">
                {s.content}
              </div>
            </section>
          </ScrollReveal>
        ))}
      </div>
    </div>
    </>
  );
}
