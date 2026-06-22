"use client";

import { PortableText as BasePortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-2xl font-bold text-ink mt-10 mb-4 border-b border-hairline pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-xl font-bold text-ink mt-8 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href: string };
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink underline underline-offset-2 hover:text-gold transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  return (
    <BasePortableText
      value={value as PortableTextBlock[]}
      components={components}
    />
  );
}
