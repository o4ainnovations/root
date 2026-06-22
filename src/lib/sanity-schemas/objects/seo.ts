const seo = {
  name: "seo",
  title: "SEO & Social",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "50-60 characters. Appears in search results and browser tabs.",
      validation: (Rule: { max: (n: number) => { warning: (msg: string) => unknown } }) =>
        Rule.max(70).warning("Recommended max 70 characters for search engines"),
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      description: "150-160 characters. The snippet shown under the title in search results.",
      validation: (Rule: { max: (n: number) => { warning: (msg: string) => unknown } }) =>
        Rule.max(200).warning("Recommended max 200 characters for search engines"),
    },
    {
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "1200×630px. Shown when this page is shared on LinkedIn, Twitter, etc.",
      options: { hotspot: true },
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Comma-separated keywords for this page.",
    },
    {
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "When enabled, this page will not appear in Google search results.",
    },
  ],
};

export default seo;
