import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export default async function LegalPage({ kind }: { kind: "impressum" | "datenschutz" }) {
  const content = await getSiteContent();
  const page = content.legal[kind];
  const impressum = content.legal.impressum;
  const company = content.company;
  return <><SiteHeader siteContent={content} /><main><section className="section legal-page"><div className="container"><p className="eyebrow">Rechtliches</p><h1>{page.title}</h1>{kind === "impressum" && <><p><strong>{company.name}</strong><br />{company.owner && <>Inhaberin: {company.owner}<br /></>}{company.address}<br /><a href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}>{company.phone}</a><br /><a href={`mailto:${encodeURIComponent(company.email)}`}>{company.email}</a></p>{(impressum.registerCourt || impressum.registerNumber) && <p>{impressum.registerCourt && <>Registergericht: {impressum.registerCourt}<br /></>}{impressum.registerNumber && <>Registernummer: {impressum.registerNumber}</>}</p>}{impressum.vatId && <p>Umsatzsteuer-ID: {impressum.vatId}</p>}</>}{page.sections.map((section, index) => <section key={index}>{section.title && <h2>{section.title}</h2>}{section.text && <p className="legal-text">{section.text}</p>}</section>)}</div></section></main><SiteFooter siteContent={content} /></>;
}
