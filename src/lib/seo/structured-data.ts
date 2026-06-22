import { COMPANY } from "./constants";
import { BreadcrumbItem, NewsArticleConfig, PersonConfig, JobPostingConfig, EventConfig } from "./types";

export function buildCorporationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    alternateName: COMPANY.alternateName,
    url: COMPANY.url,
    sameAs: COMPANY.sameAs,
    logo: COMPANY.logo,
    description: COMPANY.description,
    slogan: COMPANY.slogan,
    foundingDate: COMPANY.foundingDate,
    contactPoint: {
      "@type": "ContactPoint",
      email: COMPANY.contact.general,
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: COMPANY.address.addressCountry,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.name,
    alternateName: COMPANY.alternateName,
    url: COMPANY.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${COMPANY.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const list = [
    { "@type": "ListItem" as const, position: 1, name: "O4A", item: COMPANY.url },
    ...items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 2,
      name: item.name,
      item: item.href ? `${COMPANY.url}${item.href}` : undefined,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.filter((l) => l.item),
  };
}

export function buildNewsArticleSchema(config: NewsArticleConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: config.headline,
    image: [config.imageUrl],
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.url,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      logo: {
        "@type": "ImageObject",
        url: COMPANY.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": config.url,
    },
  };
}

export function buildPersonSchema(config: PersonConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.name,
    jobTitle: config.jobTitle,
    description: config.description,
    ...(config.imageUrl && { image: config.imageUrl }),
    url: config.url,
    worksFor: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.url,
    },
  };
}

export function buildFaqSchema(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function buildJobPostingSchema(config: JobPostingConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: config.title,
    description: config.description,
    datePosted: config.datePosted,
    hiringOrganization: {
      "@type": "Organization",
      name: COMPANY.name,
      sameAs: COMPANY.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: config.location,
      },
    },
    employmentType: config.employmentType,
  };
}

export function buildEventSchema(config: EventConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.name,
    startDate: config.startDate,
    endDate: config.endDate,
    location: {
      "@type": "Place",
      name: config.location,
    },
    description: config.description,
    url: config.url,
    organizer: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.url,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  };
}
