import Link from "next/link";
import Image from "next/image";

export default function SiteHeader({
  phone = "Kontakt aufnehmen",
}: {
  phone?: string;
}) {
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
        <Link className="nav-home" href="/">
          Startseite
        </Link>
        <Link href="/leistungen">Leistungen</Link>
        <Link href="/ueber-uns">Über uns</Link>
        <Link href="/gallery">Referenzen</Link>
        <Link href="/kontakt">Kontakt</Link>
      </nav>
      <a className="header-phone" href="/kontakt">
        <span>↗</span>
        {phone}
      </a>
      <details className="mobile-nav">
        <summary aria-label="Navigation öffnen">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile Navigation">
          <Link href="/">Startseite</Link>
          <Link href="/leistungen">Leistungen</Link>
          <Link href="/ueber-uns">Über uns</Link>
          <Link href="/gallery">Referenzen</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
      </details>
    </header>
  );
}
