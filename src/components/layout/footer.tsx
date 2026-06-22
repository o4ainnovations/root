import Link from "next/link";

const footerLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/investors", label: "Investors" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/legal", label: "Legal" },
  { href: "/esg", label: "ESG" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-border pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-2xl font-bold text-ink">O4A</p>
            <p className="label-uppercase mt-2">A Holding Company</p>
          </div>

          <nav className="flex flex-col gap-2">
            {footerLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-xs tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-2">
            {footerLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-xs tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-2">
            <Link href="/legal#privacy" className="nav-link text-xs tracking-wider">
              Privacy Policy
            </Link>
            <Link href="/legal#terms" className="nav-link text-xs tracking-wider">
              Terms of Service
            </Link>
          </nav>
        </div>

        <div className="border-double-rule pt-6 text-center">
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
            &copy; {new Date().getFullYear()} O4A. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
