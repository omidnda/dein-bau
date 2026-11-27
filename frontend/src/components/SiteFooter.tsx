import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteContent, type SiteContent } from "@/content/site";

export default async function SiteFooter({
  siteContent,
}: { siteContent?: SiteContent } = {}) {
  const { company } = siteContent ?? (await getSiteContent());
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <p className="footer-kicker">{company.name}</p>
          <p className="footer-title">Räume, die bleiben.</p>
          <p className="muted">
            {company.tagline}
          </p>
          <div className="contact-icon-row footer-address"><MapPin size={17} aria-hidden="true" /><span>{company.address}</span></div>
        </div>
        <div>
          <p className="footer-kicker">Navigation</p>
          <Link href="/leistungen">Leistungen</Link>
          <Link href="/gallery">Referenzen</Link>
          <Link href="/ueber-uns">Über uns</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/faq">Häufige Fragen</Link>
        </div>
        <div>
          <p className="footer-kicker">Direkt</p>
          <Link href="/kontakt">Projekt anfragen</Link>
          <a className="contact-icon-row" href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}>
            <Phone size={17} aria-hidden="true" /><span>{company.phone}</span>
          </a>
          <a className="contact-icon-row" href={`mailto:${encodeURIComponent(company.email)}`}>
            <Mail size={17} aria-hidden="true" /><span>{company.email}</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <span>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </span>
      </div>
    </footer>
  );
}
