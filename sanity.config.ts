import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import seo from "./src/lib/sanity-schemas/objects/seo";
import subsidiary from "./src/lib/sanity-schemas/subsidiary";
import teamMember from "./src/lib/sanity-schemas/team-member";
import pressRelease from "./src/lib/sanity-schemas/press-release";
import download from "./src/lib/sanity-schemas/download";
import pageContent from "./src/lib/sanity-schemas/page-content";
import job from "./src/lib/sanity-schemas/job";
import contactSubmission from "./src/lib/sanity-schemas/contact-submission";
import siteSettings from "./src/lib/sanity-schemas/site-settings";
import authorizedUser from "./src/lib/sanity-schemas/authorized-user";

export default defineConfig({
  name: "o4a-cms",
  title: "O4A CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x8ferdv3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      seo,
      subsidiary,
      teamMember,
      pressRelease,
      download,
      pageContent,
      job,
      contactSubmission,
      siteSettings,
      authorizedUser,
    ],
  },
});
