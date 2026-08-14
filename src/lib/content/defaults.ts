import { COMPANY } from "@/lib/seo/constants";

export const HOME_DEFAULTS = {
  metaTitle: "Home",
  metaDescription:
    "O4A is a holding company that builds, operates, and invests in companies, products, and projects.",
  companyName: "O4A",
  tagline: "A holding company. Building and operating businesses.",
  portfolioLabel: "Portfolio",
  aboutLabel: "About O4A",
  investorsLabel: "Investor Relations",
  newsLabel: "Newsroom",
  careersLabel: "Careers",
  contactLabel: "Contact",
};

export const PORTFOLIO_DEFAULTS = {
  metaTitle: "Portfolio",
  metaDescription:
    "Explore the companies, products, and projects in the O4A portfolio.",
  introText:
    "O4A owns and operates a diverse portfolio of companies across multiple industries. Each subsidiary operates independently under the O4A umbrella.",
};

export const ABOUT_DEFAULTS = {
  metaTitle: "About",
  metaDescription: "Learn about O4A — our mission, governance, and leadership.",
  missionText: `O4A exists to build, operate, and invest in businesses that solve meaningful problems. We are a holding company that provides capital, operational expertise, and strategic guidance to our portfolio companies, allowing them to focus on what they do best.

Our approach is patient and long-term. We do not flip companies — we build them. We invest in exceptional teams, provide the resources they need to succeed, and maintain ownership over decades, not quarters.

Integrity, operational excellence, and a relentless focus on creating value define everything we do.`,
  timelineYear: "2026",
  timelineTitle: "O4A Founded",
  timelineDesc:
    "O4A was established as a holding company to build, operate, and invest in transformative businesses across technology, media, and services.",
  foundedYear: "2026",
  headquarters: "United Kingdom",
  structure: "Private Holding Company",
};

export const INVESTORS_DEFAULTS = {
  metaTitle: "Investor Relations",
  metaDescription:
    "Investor information for O4A — governance, financials, and reports.",
  introText:
    "O4A is a privately held company. We are committed to transparency and long-term value creation for all stakeholders.",
  ownershipHeading: "Ownership & Structure",
  ownershipBody: `O4A is a privately held holding company. We are not publicly traded and do not offer securities to the public. Our capital comes from the founding team and strategic partnerships.

This structure allows us to make decisions based on long-term value creation rather than quarterly earnings pressure. We invest with a multi-decade time horizon.`,
  governanceHeading: "Governance",
  governanceBody: `O4A is governed by its Board of Directors, which provides strategic oversight and ensures the company operates in accordance with its fiduciary duties and ethical standards.

Our governance framework includes regular board meetings, independent audit review, and transparent reporting to stakeholders. Governance documents are available for download.`,
  financialHeading: "Financial Overview",
  financialBody: `As a private company, O4A does not publicly disclose detailed financial statements. However, we provide periodic updates to stakeholders through our annual reports and press releases.

Our financial strategy prioritizes sustainable growth, operational efficiency, and reinvestment into our portfolio companies.`,
  investorEmail: COMPANY.contact.investors,
  investorResponseTime: "2 business days",
};

export const NEWS_DEFAULTS = {
  metaTitle: "Newsroom",
  metaDescription:
    "Official press releases, announcements, and media resources from O4A.",
  introText:
    "Official press releases, announcements, and corporate news from O4A and its subsidiaries.",
  mediaEmail: COMPANY.contact.press,
  mediaKitText:
    "Brand assets, executive photos, and boilerplate text are available upon request. Contact the press office for access.",
};

export const CAREERS_DEFAULTS = {
  metaTitle: "Careers",
  metaDescription:
    "Join O4A and help build the future. Explore open positions across our portfolio companies.",
  introText:
    "Join O4A and help build the next generation of companies. We seek exceptional people who think in decades, not quarters.",
  whyO4AText: `We believe the best companies are built over decades. At O4A, you will work on enduring problems with talented people who share a commitment to excellence and integrity.

As a holding company, careers at O4A span multiple industries, business models, and stages of growth. One day you might be incubating a new venture; the next, optimizing operations at a mature subsidiary.`,
  value1Title: "Long-Term Thinking",
  value1Desc:
    "We make decisions with a multi-decade horizon. Speed is good; direction is better.",
  value2Title: "Ownership",
  value2Desc:
    "Everyone at O4A thinks like an owner. We take responsibility for outcomes.",
  value3Title: "Integrity",
  value3Desc: "We do what we say. Trust is our most valuable asset.",
  value4Title: "Excellence",
  value4Desc:
    "We hold ourselves to the highest standard in everything we do.",
  hiringTitle: "How We Hire",
  hiringSteps:
    "Submit your application\nInitial conversation with our team\nDeep-dive interviews with future colleagues\nReference checks\nOffer and onboarding",
};

export const CONTACT_DEFAULTS = {
  metaTitle: "Contact",
  metaDescription:
    "Get in touch with O4A. For media, investor, partnership, and general inquiries.",
  introText:
    "Select the appropriate category below. We respond to all inquiries within 2 business days.",
  generalEmail: COMPANY.contact.general,
  pressEmail: COMPANY.contact.press,
  investorsEmail: COMPANY.contact.investors,
  partnershipsEmail: COMPANY.contact.partnerships,
  officeLocation: "United Kingdom",
};

export const ESG_DEFAULTS = {
  metaTitle: "ESG & Sustainability",
  metaDescription:
    "Environmental, social, and governance commitments and initiatives at O4A.",
  commitmentText: `At O4A, we believe that long-term value creation depends on responsible business practices. Our approach to ESG is integrated into our investment decisions, operational management, and corporate governance.

We are a young company actively building our ESG framework. As we grow, we will set measurable targets, publish annual reports, and hold ourselves accountable to stakeholders.`,
  envText:
    "Our portfolio companies are encouraged to operate sustainably. We consider environmental impact when evaluating new investments and prioritize resource efficiency.",
  socialText:
    "We are committed to fostering diverse, inclusive workplaces across our portfolio. We believe that exceptional talent comes from all backgrounds, and we seek to create environments where everyone can thrive.",
  govText:
    "Strong governance is the foundation of O4A. Our board oversees ESG strategy, risk management, and ethical conduct. We maintain transparent policies and comply with all applicable laws and regulations.",
};

export const LEGAL_DEFAULTS = {
  metaTitle: "Legal & Governance",
  metaDescription:
    "Privacy policy, terms of service, and legal information for O4A.",
  noindex: true,
};
