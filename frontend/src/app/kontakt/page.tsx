import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export const metadata = { title: "Kontakt", description: "Ihr Projekt mit Dein Bau Hub in Hamburg besprechen." };
export default async function ContactPage() { const content = await getSiteContent(); return <><SiteHeader /><main><section className="page-intro"><div className="container"><p className="eyebrow">Direkt und persönlich</p><h1>Ihr Projekt beginnt<br />mit einem Gespräch.</h1><p>{content.contact.text}</p></div></section><section className="section contact-section"><div className="container contact-layout"><div><p className="eyebrow">Anfrage</p><h2>Wie können wir helfen?</h2><p className="large-copy">Beschreiben Sie Ihr Vorhaben. Wir melden uns nach Eingang Ihrer Nachricht.</p><div className="contact-address"><strong>{content.company.name}</strong><span>{content.company.address}</span><span>{content.company.phone}</span><span>{content.company.email}</span></div></div><ContactForm services={content.services} /></div></section></main><SiteFooter /></>; }
