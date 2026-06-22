"use client";

import { useState, useEffect } from "react";
import { sanityFetch } from "@/lib/sanity";
import { updateSiteSettings, createSiteSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  _id,
  companyName,
  legalName,
  shortTagline,
  fullTagline,
  description,
  foundingDate,
  addressCountry,
  contactGeneral,
  contactPress,
  contactInvestors,
  contactPartnerships,
  socialTwitter,
  socialLinkedIn,
  socialGitHub,
  defaultMetaTitle,
  defaultMetaDescription,
  gaId
}`;

const DEFAULT_VALUES: Record<string, string> = {
  companyName: "",
  legalName: "",
  shortTagline: "",
  fullTagline: "",
  description: "",
  foundingDate: "",
  addressCountry: "",
  contactGeneral: "",
  contactPress: "",
  contactInvestors: "",
  contactPartnerships: "",
  socialTwitter: "",
  socialLinkedIn: "",
  socialGitHub: "",
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  gaId: "",
};

const FIELD_LABELS: Record<string, string> = {
  companyName: "Company Name",
  legalName: "Legal Name",
  shortTagline: "Short Tagline",
  fullTagline: "Full Tagline",
  description: "Description",
  foundingDate: "Founding Date",
  addressCountry: "Country",
  contactGeneral: "General Inquiries",
  contactPress: "Press / Media",
  contactInvestors: "Investor Relations",
  contactPartnerships: "Partnerships",
  socialTwitter: "Twitter",
  socialLinkedIn: "LinkedIn",
  socialGitHub: "GitHub",
  defaultMetaTitle: "Default Meta Title",
  defaultMetaDescription: "Default Meta Description",
  gaId: "Google Analytics ID",
};

const SECTION_FIELDS: { label: string; keys: string[] }[] = [
  {
    label: "Company",
    keys: [
      "companyName",
      "legalName",
      "shortTagline",
      "fullTagline",
      "description",
      "foundingDate",
      "addressCountry",
    ],
  },
  {
    label: "Contact",
    keys: [
      "contactGeneral",
      "contactPress",
      "contactInvestors",
      "contactPartnerships",
    ],
  },
  {
    label: "Social",
    keys: ["socialTwitter", "socialLinkedIn", "socialGitHub"],
  },
  {
    label: "SEO Defaults",
    keys: ["defaultMetaTitle", "defaultMetaDescription"],
  },
  {
    label: "Analytics",
    keys: ["gaId"],
  },
];

const TEXTAREA_FIELDS = new Set(["description", "defaultMetaDescription"]);

function buildValues(data: Record<string, unknown>): Record<string, string> {
  const v: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_VALUES)) {
    v[key] = typeof data[key] === "string" ? (data[key] as string) : "";
  }
  return v;
}

export default function SettingsPageClient() {
  const [values, setValues] = useState<Record<string, string>>(DEFAULT_VALUES);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    sanityFetch<Record<string, unknown> | null>({
      query: SETTINGS_QUERY,
      tags: ["siteSettings"],
    }).then(async (result) => {
      if (cancelled) return;

      if (!result) {
        await createSiteSettings(DEFAULT_VALUES);
        const fresh = await sanityFetch<Record<string, unknown> | null>({
          query: SETTINGS_QUERY,
          tags: ["siteSettings"],
        });
        if (cancelled) return;
        if (fresh && fresh._id) {
          setSettingsId(fresh._id as string);
          setValues(buildValues(fresh));
        }
      } else {
        setSettingsId(result._id as string);
        setValues(buildValues(result));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settingsId) return;

    setSaving(true);
    try {
      await updateSiteSettings(settingsId, values);
      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="font-heading text-3xl font-bold text-ink">
            Site Settings
          </h1>
          <p className="font-serif text-muted-foreground mt-2">
            Manage global site configuration.
          </p>
        </div>
        <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground font-serif">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Site Settings
        </h1>
        <p className="font-serif text-muted-foreground mt-2">
          Manage global site configuration.
        </p>
      </div>

      <Card className="card-depth-1 border-border">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            {SECTION_FIELDS.map((section, si) => (
              <div
                key={section.label}
                className={si > 0 ? "border-t border-border" : ""}
              >
                <div className="px-6 py-4 bg-paper-shadow">
                  <h2 className="font-heading text-lg font-bold text-ink">
                    {section.label}
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {section.keys.map((key) => {
                    const isTextarea = TEXTAREA_FIELDS.has(key);
                    const Component = isTextarea ? Textarea : Input;

                    return (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="label-uppercase block mb-2"
                        >
                          {FIELD_LABELS[key] || key}
                        </label>
                        <Component
                          id={key}
                          value={values[key] || ""}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >,
                          ) => handleChange(key, e.target.value)}
                          placeholder={`Enter ${FIELD_LABELS[key]?.toLowerCase() || key}...`}
                          rows={isTextarea ? 4 : undefined}
                          className="rounded-none border-border bg-background font-serif"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="border-t border-border px-6 py-4 flex items-center justify-end">
              <Button
                type="submit"
                disabled={saving || !settingsId}
                className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-3.5 w-3.5" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
