import { Mail } from "lucide-react";
import LegalMarkdown from "@/components/LegalMarkdown";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export default async function LegalPage({
  kind,
}: {
  kind: "impressum" | "datenschutz";
}) {
  const content = await getSiteContent();
  const page = content.legal[kind];
  const impressum = content.legal.impressum;
  const company = content.company;
  return (
    <>
      <SiteHeader siteContent={content} />
      <main>
        <section className="section legal-page">
          <div className="container">
            <p className="eyebrow">Rechtliches</p>
            <h1>{page.title}</h1>
            {kind === "impressum" && (
              <>
                <section>
                  <h2>Angaben zum Unternehmen</h2>
                  <p>
                    <strong>{company.name}</strong>
                    <br />
                    {company.owner && (
                      <>
                        Inhaberin: {company.owner}
                        <br />
                      </>
                    )}
                    {company.address}
                  </p>
                </section>
                <section>
                  <h2>Kontakt</h2>
                  <p>
                    Telefon:{" "}
                    <a href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}>
                      {company.phone}
                    </a>
                    <br />
                    E-Mail:{" "}
                    <a href={`mailto:${encodeURIComponent(company.email)}`}>
                      <Mail size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "text-bottom" }} /> {company.email}
                    </a>
                  </p>
                </section>
                {(impressum.registerCourt || impressum.registerNumber) && (
                  <section>
                    <h2>Registereintrag</h2>
                    <p>
                      {impressum.registerCourt && (
                        <>
                          Registergericht: {impressum.registerCourt}
                          <br />
                        </>
                      )}
                      {impressum.registerNumber && (
                        <>Registernummer: {impressum.registerNumber}</>
                      )}
                    </p>
                  </section>
                )}
                {impressum.vatId && (
                  <section>
                    <h2>Umsatzsteuer</h2>
                    <p>Umsatzsteuer-Identifikationsnummer: {impressum.vatId}</p>
                  </section>
                )}
              </>
            )}
            {kind === "datenschutz" && (
              <section>
                <h2>1. Verantwortlicher</h2>
                <p>
                  <strong>{company.name}</strong>
                  <br />
                  {company.owner && (
                    <>
                      {company.owner}
                      <br />
                    </>
                  )}
                  {company.address}
                  <br />
                  Telefon:{" "}
                  <a href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}>
                    {company.phone}
                  </a>
                  <br />
                  E-Mail:{" "}
                  <a href={`mailto:${encodeURIComponent(company.email)}`}>
                    <Mail size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "text-bottom" }} /> {company.email}
                  </a>
                </p>
              </section>
            )}
            {page.sections.map((section, index) => (
              <section key={index}>
                {section.title && <h2>{section.title}</h2>}
                {section.text && <LegalMarkdown text={section.text} />}
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter siteContent={content} />
    </>
  );
}
