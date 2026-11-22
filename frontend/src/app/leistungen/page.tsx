import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/content/site";

export const metadata = { title: "Leistungen", description: "Innenausbau, Badsanierung, Bodenarbeiten und weitere Bauleistungen in Hamburg." };
export default async function LeistungenPage() { const content = await getSiteContent(); return <><SiteHeader /><main><section className="page-intro"><div className="container"><p className="eyebrow">Leistungsübersicht</p><h1>Was soll sich<br />verändern?</h1><p>Von einzelnen Ausbauarbeiten bis zur umfassenden Sanierung: Wir klären den Bedarf und koordinieren den Weg.</p></div></section><section className="section services-section"><div className="container service-detail-list">{content.services.map((service, index) => <article className="detail-row" id={service.slug} key={service.slug}><div className="detail-image"><Image src={service.image} alt={`Visualisierung: ${service.title}`} fill sizes="(max-width: 700px) 100vw, 45vw" /></div><div className="detail-copy"><span className="service-number">0{index + 1}</span><h2>{service.title}</h2><p className="large-copy">{service.summary}</p><p>{service.details}</p><Link className="text-link" href="/kontakt">Projekt besprechen <span>↗</span></Link></div></article>)}</div></section></main><SiteFooter /></>; }
