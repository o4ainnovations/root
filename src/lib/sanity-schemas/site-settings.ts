const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fieldsets: [
    { name: "company", title: "Company" },
    { name: "branding", title: "Branding" },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social Media" },
    { name: "seo", title: "SEO Defaults" },
    { name: "analytics", title: "Analytics" },
  ],
  fields: [
    {
      name: "title",
      title: "Settings Name",
      type: "string",
      initialValue: "O4A Site Settings",
      hidden: true,
    },
    // Company
    {
      name: "companyName",
      title: "Company Name",
      type: "string",
      fieldset: "company",
    },
    {
      name: "legalName",
      title: "Legal Name",
      type: "string",
      fieldset: "company",
    },
    {
      name: "shortTagline",
      title: "Short Tagline",
      type: "string",
      fieldset: "company",
      description: "Building the Technologies that power the future.",
    },
    {
      name: "fullTagline",
      title: "Full Tagline",
      type: "text",
      fieldset: "company",
    },
    {
      name: "description",
      title: "Company Description",
      type: "text",
      fieldset: "company",
    },
    {
      name: "foundingDate",
      title: "Founding Date",
      type: "string",
      fieldset: "company",
    },
    {
      name: "addressCountry",
      title: "Country",
      type: "string",
      fieldset: "company",
    },
    // Branding
    {
      name: "logo",
      title: "Logo",
      type: "image",
      fieldset: "branding",
    },
    {
      name: "ogImage",
      title: "Default Social Share Image",
      type: "image",
      fieldset: "branding",
      description: "1200×630px. Fallback used when individual pages don't have their own.",
    },
    // Contact
    {
      name: "contactGeneral",
      title: "General Email",
      type: "string",
      fieldset: "contact",
    },
    {
      name: "contactPress",
      title: "Press Email",
      type: "string",
      fieldset: "contact",
    },
    {
      name: "contactInvestors",
      title: "Investors Email",
      type: "string",
      fieldset: "contact",
    },
    {
      name: "contactPartnerships",
      title: "Partnerships Email",
      type: "string",
      fieldset: "contact",
    },
    // Social
    {
      name: "socialTwitter",
      title: "X / Twitter Handle",
      type: "string",
      fieldset: "social",
    },
    {
      name: "socialLinkedIn",
      title: "LinkedIn URL",
      type: "url",
      fieldset: "social",
    },
    {
      name: "socialGitHub",
      title: "GitHub URL",
      type: "url",
      fieldset: "social",
    },
    // SEO Defaults
    {
      name: "defaultMetaTitle",
      title: "Default Meta Title",
      type: "string",
      fieldset: "seo",
      description: "Fallback for pages without their own meta title.",
    },
    {
      name: "defaultMetaDescription",
      title: "Default Meta Description",
      type: "text",
      fieldset: "seo",
    },
    {
      name: "googleVerification",
      title: "Google Site Verification",
      type: "string",
      fieldset: "seo",
      description: "Verification code if using meta tag method.",
    },
    // Analytics
    {
      name: "gaId",
      title: "Google Analytics ID",
      type: "string",
      fieldset: "analytics",
    },
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
};

export default siteSettings;
