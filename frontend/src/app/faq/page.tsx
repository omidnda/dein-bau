import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export const metadata = { title: "Häufige Fragen", description: "Häufige Fragen zu Dein Bau Hub und Ihrem Projekt." };

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const { faq } = await getSiteContent();
  const questions = faq.questions.filter((item) => item.title.trim() && item.text.trim());
  return <><SiteHeader /><main><section className="page-intro"><div className="container"><p className="eyebrow">{faq.eyebrow}</p><h1>{faq.title}</h1><p>{faq.intro}</p></div></section><section className="section faq-section"><div className="container faq-container">{questions.length ? <div className="faq-list">{questions.map((item, index) => <details className="faq-item" key={index}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.text}</p></details>)}</div> : <p>Aktuell sind noch keine Fragen veröffentlicht.</p>}<div className="faq-contact"><p>Noch eine Frage?</p><Link className="text-link" href="/kontakt">Kontakt aufnehmen <span>↗</span></Link></div></div></section></main><SiteFooter /></>;
}
