import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export const metadata = { title: "Kontakt", description: "Ihr Projekt mit Dein Bau Hub in Hamburg besprechen." };
export const dynamic = "force-dynamic";

export default async function ContactPage() { const content = await getSiteContent(); return <><SiteHeader siteContent={content} /><main><section className="page-intro contact-page-intro"><div className="container"><p className="eyebrow">Direkt und persönlich</p><h1>{content.contact.title}</h1><p>{content.contact.text}</p></div></section><section className="section contact-section contact-page-content"><div className="container contact-layout"><div><p className="eyebrow">Anfrage</p><h2>{content.pageCopy.contact.formHeading}</h2><p className="large-copy">{content.pageCopy.contact.formText}</p><div className="contact-address"><strong>{content.company.name}</strong><span className="contact-icon-row"><MapPin size={17} aria-hidden="true" /><span>{content.company.address}</span></span><a className="contact-icon-row" href={`tel:${content.company.phone.replace(/[^\d+]/g, "")}`}><Phone size={17} aria-hidden="true" /><span>{content.company.phone}</span></a><a className="contact-icon-row" href={`mailto:${encodeURIComponent(content.company.email)}`}><Mail size={17} aria-hidden="true" /><span>{content.company.email}</span></a></div></div><ContactForm services={content.services} /></div></section></main><SiteFooter siteContent={content} /></>; }
