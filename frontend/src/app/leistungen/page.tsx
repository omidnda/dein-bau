import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getRevalidatedSiteContent } from "@/content/site";

export const revalidate = 300;
export const metadata = { title: "Leistungen", description: "Innenausbau, Badsanierung, Bodenarbeiten und weitere Bauleistungen in Hamburg." };
export default async function LeistungenPage() { const content = await getRevalidatedSiteContent(); return <><SiteHeader siteContent={content} /><main><section className="page-intro"><div className="container"><p className="eyebrow">Leistungsübersicht</p><h1>{content.pageCopy.services.heading}</h1><p>{content.pageCopy.services.intro}</p></div></section><section className="section services-section"><div className="container service-detail-list">{content.services.map((service, index) => <article className="detail-row" id={service.slug} key={service.slug}><div className="detail-image"><Image src={service.image} alt={service.image.startsWith("/images/generated/") ? `Visualisierung: ${service.title}` : service.title} fill sizes="(max-width: 700px) 100vw, 45vw" /></div><div className="detail-copy"><span className="service-number">0{index + 1}</span><h2>{service.title}</h2><p className="large-copy">{service.summary}</p><p>{service.details}</p><Link className="text-link" href="/kontakt">Projekt besprechen <span>↗</span></Link></div></article>)}</div></section></main><SiteFooter siteContent={content} /></>; }
