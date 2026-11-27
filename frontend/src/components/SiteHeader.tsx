import Link from "next/link";
import { Phone } from "lucide-react";
import Image from "next/image";
import { getSiteContent, type SiteContent } from "@/content/site";

export default async function SiteHeader({
  phone = "Kontakt aufnehmen",
  siteContent,
}: {
  phone?: string;
  siteContent?: SiteContent;
}) {
  const content = siteContent ?? (await getSiteContent());
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <Image
          src="/logo/dein-bau-hub-exact.svg"
          alt="Dein Bau Hub"
          width={112}
          height={52}
          priority
        />
        {/* <span>
          DEIN BAU HUB<small>HAMBURG</small>
        </span> */}
      </Link>
      <nav aria-label="Hauptnavigation">
        {content.nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="header-phone" href="/kontakt">
        <span>↗</span>
        {phone}
      </a>
      <div className="mobile-header-actions">
        <a href={`tel:${content.company.phone.replace(/[^\d+]/g, "")}`} aria-label="Jetzt anrufen"><Phone size={20} aria-hidden="true" /></a>
      </div>
      <details className="mobile-nav">
        <summary aria-label="Navigation öffnen">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile Navigation">
          {content.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
