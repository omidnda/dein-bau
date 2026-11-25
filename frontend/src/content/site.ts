import { fetchBackend } from "@/lib/backend-api";

export type Service = { slug: string; title: string; summary: string; details: string; image: string };
export type MediaAsset = { id: number | string; name: string; contentType: string; mediaType: "image" | "video"; title: string; alt: string; category: string; isFeatured: boolean; url: string };

export type ReferenceProject = { title: string; text: string; beforeImage?: string; afterImage?: string; mediaIds?: (number | string)[] };

export type HomeContent = {
  heroSecondary: string; heroProof: string; heroImageLabel: string; heroSecondImage: string; heroThirdImage: string;
  servicesEyebrow: string; servicesHeading: string; servicesLink: string; serviceLink: string;
  companyEyebrow: string; companyHeading: string; companyText: string; companyLink: string; companyImage: string;
  quickLabel: string; quickContact: string; quickGallery: string; quickServices: string;
  trustEyebrow: string; trustHeading: string; trustPoints: { title: string; text: string }[];
  comparisonEyebrow: string; comparisonHeading: string; comparisonText: string; beforeImage: string; afterImage: string; comparisonDisclaimer: string;
  processEyebrow: string; processHeading: string; steps: { title: string; text: string }[];
  galleryEyebrow: string; galleryHeading: string; galleryLink: string; galleryMediaIds?: (number | string)[];
  reviewsEyebrow: string; reviewsHeading: string; reviewsText: string; reviewsListHeading: string; reviewsButton: string;
  contactEyebrow: string;
};

export type SiteContent = {
  company: { name: string; owner: string; phone: string; email: string; address: string; tagline: string };
  nav: { label: string; href: string }[];
  hero: { eyebrow: string; title: string; text: string; image: string };
  home: HomeContent;
  services: Service[];
  about: { intro: string; points: { title: string; text: string }[] };
  gallery: { intro: string; mediaIds?: (number | string)[]; projects: ReferenceProject[] };
  legal: { impressum: { title: string; vatId: string; registerCourt: string; registerNumber: string; sections: { title: string; text: string }[] }; datenschutz: { title: string; sections: { title: string; text: string }[] } };
  faq: { eyebrow: string; title: string; intro: string; questions: { title: string; text: string }[] };
  aboutImage: string;
  pageCopy: { gallery: { heading: string; projectsHeading: string; photosHeading: string }; about: { heading: string; approachHeading: string; approachText: string; portraitHeading: string; portraitText: string; valuesHeading: string }; services: { heading: string; intro: string }; contact: { formHeading: string; formText: string } };
  contact: { title: string; text: string; button: string };
};

export const defaultContent: SiteContent = {
  company: { name: "Dein Bau Hub e.K.", owner: "Seyedeh Razieh Ahmadi", phone: "01732651582", email: "deinbauhub@gmail.com", address: "Butjadingerweg 3, 21129 Hamburg", tagline: "Innenausbau · Bausanierung · Modernisierung" },
  nav: [{ label: "Startseite", href: "/" }, { label: "Leistungen", href: "/leistungen" }, { label: "Über uns", href: "/ueber-uns" }, { label: "Referenzen", href: "/gallery" }, { label: "Kontakt", href: "/kontakt" }, { label: "FAQ", href: "/faq" }],
  hero: { eyebrow: "Innenausbau · Bausanierung · Modernisierung", title: "Ihr Projekt. Unser Handwerk. Ein Ansprechpartner.", text: "Innenausbau, Bausanierung und Modernisierung in Hamburg – klar geplant, sauber koordiniert und fachgerecht umgesetzt.", image: "/images/generated/hero-renovation.png" },
  home: {
    heroSecondary: "Unsere Leistungen", heroProof: "Persönliche Beratung · Transparente Angebote · Zuverlässige Umsetzung", heroImageLabel: "Innenausbau & Modernisierung", heroSecondImage: "/images/generated/interior-renovation.png", heroThirdImage: "/images/generated/bathroom-renovation.png",
    servicesEyebrow: "01 / Unsere Leistungen", servicesHeading: "Räume verändern. Werte erhalten.", servicesLink: "Alle Leistungen ansehen", serviceLink: "Mehr erfahren",
    companyEyebrow: "02 / Über Dein Bau Hub", companyHeading: "Ein Team. Ein Ansprechpartner. Ein klares Ziel.", companyText: "Von der ersten Besichtigung bis zur Übergabe verbinden wir sorgfältige Ausbauarbeiten mit einer klaren Koordination aller beteiligten Gewerke.", companyLink: "Mehr über uns", companyImage: "/images/generated/bathroom-renovation.png",
    quickLabel: "Direkter Zugang", quickContact: "Angebot anfragen", quickGallery: "Referenzen", quickServices: "Leistungen",
    trustEyebrow: "Was Sie erwarten können", trustHeading: "Strukturiert von der ersten Frage bis zur Übergabe.", trustPoints: [{ title: "Klare Kommunikation", text: "Direkte Absprachen und verständliche Antworten während des gesamten Projekts." }, { title: "Transparente Abläufe", text: "Ein nachvollziehbarer Ablauf mit Besichtigung, Angebot, Ausführung und Übergabe." }, { title: "Ein Ansprechpartner", text: "Eine zentrale Koordination für eigene Arbeiten und beteiligte Fachbetriebe." }],
    comparisonEyebrow: "Einblicke in den Ablauf", comparisonHeading: "Von der Planung bis zur Übergabe.", comparisonText: "Auf den Detailseiten erzählen wir den Ablauf eines Projekts. Hier nur ein kurzer Einblick – direkt, ohne erzwungene Scrollstrecke.", beforeImage: "/images/generated/material-planning.png", afterImage: "/images/generated/bathroom-renovation.png", comparisonDisclaimer: "Die gezeigten Bilder sind generierte Visualisierungen und keine echten Referenzen.",
    processEyebrow: "03 / So arbeiten wir", processHeading: "Sechs Schritte. Ein Ansprechpartner.", steps: [{ title: "Anfrage", text: "Sie schildern uns Ihr Vorhaben und Ihre ersten Vorstellungen." }, { title: "Beratung & Besichtigung", text: "Wir besprechen Ihre Wünsche und erfassen die Ausgangssituation vor Ort." }, { title: "Individuelles Angebot", text: "Sie erhalten eine nachvollziehbare Beschreibung der vereinbarten Leistungen." }, { title: "Vorbereitung & Planung", text: "Wir stimmen Termine, Materialien und beteiligte Fachbetriebe aufeinander ab." }, { title: "Fachgerechte Ausführung", text: "Eigene Fachkräfte und projektbezogene Partner setzen die vereinbarten Arbeiten um." }, { title: "Fertigstellung & Übergabe", text: "Zum Abschluss prüfen wir gemeinsam die vereinbarten Leistungen." }],
    galleryEyebrow: "Referenzen", galleryHeading: "Material, Räume, Fortschritt.", galleryLink: "Zu den Referenzen",
    reviewsEyebrow: "Bewertungen", reviewsHeading: "Ihre Erfahrung zählt.", reviewsText: "Teilen Sie Ihre Erfahrung mit uns. Bewertungen werden vor der Veröffentlichung geprüft.", reviewsListHeading: "Stimmen unserer Kunden", reviewsButton: "Bewertung abgeben", contactEyebrow: "Ihr Projekt",
  },
  services: [
    { slug: "innenausbau", title: "Innenausbau & Trockenbau", summary: "Räume neu denken und präzise ausbauen.", details: "Trennwände, Decken, Installationsverkleidungen, Vorsatzschalen und Oberflächenvorbereitung.", image: "/images/generated/interior-renovation.png" },
    { slug: "bad", title: "Badsanierung", summary: "Funktionale Bäder mit sauberer Koordination.", details: "Rückbau, Vorbereitung, Abdichtung im zulässigen Umfang und Koordination qualifizierter Fachbetriebe.", image: "/images/generated/bathroom-renovation.png" },
    { slug: "boden", title: "Bodenarbeiten", summary: "Ein starker Untergrund für den Alltag.", details: "Untergrundvorbereitung, Ausgleich, Klick-Vinyl, Laminat, Designbeläge und Sockelleisten.", image: "/images/generated/interior-renovation.png" },
    { slug: "umbau", title: "Maurer- & Umbauarbeiten", summary: "Veränderungen mit technischer Sorgfalt.", details: "Öffnungen, Laibungen, Installationsschächte und kleinere Ausbesserungsarbeiten. Statische Eingriffe nur nach Prüfung.", image: "/images/generated/facade-renovation.png" },
    { slug: "fenster", title: "Fenster & Türen", summary: "Montage und Anschlüsse, die präzise sitzen.", details: "Demontage, Montage, Öffnungsvorbereitung, Zargen sowie Anschlussnachbearbeitung.", image: "/images/generated/hero-renovation.png" },
    { slug: "oberflaechen", title: "Maler & Oberflächen", summary: "Der letzte Millimeter macht den Unterschied.", details: "Spachteln, Schleifen, Grundieren, Tapezieren und Innenanstriche.", image: "/images/generated/material-planning.png" },
    { slug: "fassade", title: "Fassade & Außenarbeiten", summary: "Koordinierte Lösungen für die Gebäudehülle.", details: "Projektbezogene Koordination von Instandsetzung, Dämmung, Bekleidungen und Verfugung.", image: "/images/generated/facade-renovation.png" },
  ],
  about: { intro: "Sanierung ist eine Folge guter Entscheidungen. Wir machen diese Entscheidungen verständlich und den Ablauf nachvollziehbar.", points: [{ title: "Verantwortung", text: "Klare Absprachen und eine realistische Einschätzung des Projekts." }, { title: "Koordination", text: "Eigene Ausbauarbeiten ergänzt durch qualifizierte Fach- und Meisterbetriebe." }, { title: "Transparenz", text: "Nachvollziehbare Leistungsbeschreibungen, Mengen und Einheitspreise." }] },
  gallery: { intro: "Entdecken Sie Aufnahmen unserer Sanierungs-, Ausbau- und Modernisierungsarbeiten.", projects: [{ title: "Rellingen", text: "Umfassende Haussanierung und Modernisierung mit Trockenbau, Untergrundvorbereitung, Bodenbelägen, Badmodernisierung und Malerarbeiten." }, { title: "Hamburg-Finkenwerder", text: "Innenausbau und Modernisierung mit Trockenbau, integrierter indirekter Beleuchtung sowie Bodenbelags- und Malerarbeiten." }, { title: "Hamburg-Niendorf", text: "Trockenbau mit Gipskartonplatten und Verlegung von Klickvinylboden inklusive Sockelleisten." }] },
  legal: {
    impressum: { title: "Impressum", vatId: "DE455120096", registerCourt: "", registerNumber: "", sections: [] },
    datenschutz: { title: "Datenschutz", sections: [{"title": "2. Allgemeine Hinweise", "text": "Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den geltenden Datenschutzvorschriften. Personenbezogene Daten sind Informationen, mit denen Sie persönlich identifiziert werden können."}, {"title": "3. Server-Logdaten", "text": "Beim Aufruf dieser Website werden technisch erforderliche Daten an den Webserver übermittelt. Dazu können insbesondere die aufgerufene Seite, Datum und Uhrzeit des Zugriffs, übertragene Datenmenge, Referrer-URL, Browser, Betriebssystem und IP-Adresse gehören. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren, stabilen und fehlerfreien Bereitstellung der Website sowie in der Abwehr missbräuchlicher Zugriffe."}, {"title": "4. Hosting", "text": "Diese Website und ihre Daten werden bei netcup gehostet. Der Hosting-Anbieter verarbeitet die beim Betrieb der Website anfallenden Daten, insbesondere Server-Logdaten und die über das Kontaktformular übermittelten Angaben, in unserem Auftrag. Soweit gesetzlich erforderlich, erfolgt die Verarbeitung auf Grundlage eines Vertrags zur Auftragsverarbeitung gemäß Art. 28 DSGVO."}, {"title": "5. E-Mail-Kommunikation", "text": "Für unsere geschäftliche E-Mail-Kommunikation nutzen wir Dienste der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland. Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen übermittelten Daten, insbesondere Ihre E-Mail-Adresse, der Inhalt Ihrer Nachricht sowie gegebenenfalls weitere von Ihnen übermittelte personenbezogene Daten und Anhänge, über die Mailserver von Hetzner verarbeitet.\n\nDie Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, soweit die Kommunikation der Anbahnung oder Durchführung eines Vertrags dient. In anderen Fällen erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an einer zuverlässigen und sicheren geschäftlichen Kommunikation.\n\nSoweit erforderlich, erfolgt die Verarbeitung durch Hetzner auf Grundlage eines Vertrags zur Auftragsverarbeitung gemäß Art. 28 DSGVO. Weitere Informationen zum Datenschutz bei Hetzner finden Sie in der Datenschutzerklärung von Hetzner."}, {"title": "6. Domain und DNS", "text": "Die Domain dieser Website wird über INWX verwaltet. Im Rahmen der Domainregistrierung und technischen DNS-Auflösung können technisch erforderliche Verbindungs- und Metadaten verarbeitet werden. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse besteht in der zuverlässigen Erreichbarkeit der Website."}, {"title": "7. SSL-/TLS-Verschlüsselung", "text": "Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ und dem Schloss-Symbol in der Adresszeile Ihres Browsers."}, {"title": "8. Kontaktaufnahme", "text": "Wenn Sie uns über das Kontaktformular oder telefonisch kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Angaben ausschließlich zur Bearbeitung Ihrer Anfrage und für erforderliche Anschlussfragen. Beim Kontaktformular sind dies insbesondere Name, Kontaktdaten, ausgewählte Dienstleistung und Nachricht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage der Vertragsanbahnung oder Vertragserfüllung dient, andernfalls Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der Bearbeitung Ihrer Anfrage.\n\nDie Angaben werden gelöscht, sobald Ihre Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten oder sonstigen berechtigten Gründe für eine weitere Speicherung bestehen."}, {"title": "9. Bewertungen", "text": "Wenn Sie eine Bewertung abgeben, verarbeiten wir den von Ihnen angegebenen Namen, Ihre Bewertung und Ihren Nachrichtentext sowie den Zeitpunkt der Übermittlung. Bewertungen werden vor der Veröffentlichung geprüft. Freigegebene Bewertungen werden mit Namen, Bewertung, Text und Datum auf der Website angezeigt."}, {"title": "10. Speicherdauer", "text": "Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Verarbeitungszweck erforderlich ist. Gesetzliche Aufbewahrungsfristen bleiben unberührt. Nach Wegfall des Zwecks und Ablauf einschlägiger Fristen werden die Daten gelöscht."}, {"title": "11. Ihre Rechte", "text": "Sie haben nach Maßgabe der gesetzlichen Voraussetzungen das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie gemäß Art. 7 Abs. 3 DSGVO jederzeit mit Wirkung für die Zukunft widerrufen."}, {"title": "12. Beschwerderecht", "text": "Sie haben gemäß Art. 77 DSGVO das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Sie können sich insbesondere an die für unseren Unternehmenssitz zuständige Aufsichtsbehörde wenden."}, {"title": "13. Aktualität", "text": "Wir passen diese Datenschutzerklärung an, wenn sich die Website, eingesetzte Dienste oder rechtliche Anforderungen ändern."}] },
  },
  faq: { eyebrow: "Gut zu wissen", title: "Häufige Fragen", intro: "Hier finden Sie Antworten auf häufige Fragen zu unseren Leistungen und Ihrem Projekt.", questions: [] },
  aboutImage: "/images/reference/IMG_20261123_002235_850.jpg",
  pageCopy: {
    gallery: { heading: "Einblicke, die man sieht.", projectsHeading: "Arbeit, die Räume verändert.", photosHeading: "Unsere Arbeit im Bild." },
    about: { heading: "Handwerk mit Verantwortung.", approachHeading: "Verständlich beraten. Sauber umsetzen.", approachText: "Sanierungsarbeiten bringen viele Entscheidungen mit sich. Deshalb setzen wir auf nachvollziehbare Angebote, klare Absprachen und eine strukturierte Koordination.", portraitHeading: "Ein Ansprechpartner für Ihr Projekt.", portraitText: "Wir begleiten Ihr Vorhaben mit klaren Absprachen und koordinieren die beteiligten Gewerke.", valuesHeading: "Was uns wichtig ist." },
    services: { heading: "Was soll sich verändern?", intro: "Von einzelnen Ausbauarbeiten bis zur umfassenden Sanierung: Wir klären den Bedarf und koordinieren den Weg." },
    contact: { formHeading: "Wie können wir helfen?", formText: "Beschreiben Sie Ihr Vorhaben. Wir melden uns nach Eingang Ihrer Nachricht." },
  },
  contact: { title: "Ihr Projekt beginnt mit einem Gespräch.", text: "Beschreiben Sie uns Ihr Vorhaben. Fotos, Zeichnungen oder Grundrisse können Sie später ergänzen.", button: "Projekt anfragen" },
};

export function mergeContent(value: unknown): SiteContent {
  const stored = value && typeof value === "object" ? value as Partial<SiteContent> : {};
  const impressum = { ...defaultContent.legal.impressum, ...stored.legal?.impressum };
  const datenschutz = { ...defaultContent.legal.datenschutz, ...stored.legal?.datenschutz };
  return { ...defaultContent, ...stored, company: { ...defaultContent.company, ...(stored.company ?? {}) }, hero: { ...defaultContent.hero, ...(stored.hero ?? {}) }, home: { ...defaultContent.home, ...(stored.home ?? {}), quickGallery: stored.home?.quickGallery === "Galerie" ? "Referenzen" : (stored.home?.quickGallery ?? defaultContent.home.quickGallery), galleryLink: stored.home?.galleryLink === "Zur Galerie" ? "Zu den Referenzen" : (stored.home?.galleryLink ?? defaultContent.home.galleryLink) }, contact: { ...defaultContent.contact, ...(stored.contact ?? {}) }, about: { ...defaultContent.about, ...(stored.about ?? {}) }, faq: { ...defaultContent.faq, ...(stored.faq ?? {}) }, legal: { impressum, datenschutz }, pageCopy: { gallery: { ...defaultContent.pageCopy.gallery, ...stored.pageCopy?.gallery }, about: { ...defaultContent.pageCopy.about, ...stored.pageCopy?.about }, services: { ...defaultContent.pageCopy.services, ...stored.pageCopy?.services }, contact: { ...defaultContent.pageCopy.contact, ...stored.pageCopy?.contact } }, gallery: { ...defaultContent.gallery, ...(stored.gallery ?? {}), projects: (stored.gallery?.projects ?? defaultContent.gallery.projects).map((project) => ({ beforeImage: "", afterImage: "", ...project })) }, nav: stored.nav?.length ? stored.nav : defaultContent.nav, services: stored.services?.length ? stored.services : defaultContent.services };
}

export async function getSiteContent() {
  try {
    const response = await fetchBackend("/content/site/", { cache: "no-store" });
    if (!response.ok) return defaultContent;
    const payload = (await response.json()) as { content?: { site?: unknown } };
    return mergeContent(payload.content?.site);
  } catch {
    return defaultContent;
  }
}


// ISR pages require a successful backend response so a temporary outage cannot
// replace an already generated page with fallback content during regeneration.
export async function getRevalidatedSiteContent(): Promise<SiteContent> {
  const response = await fetchBackend("/content/site/", { next: { revalidate: 300, tags: ["site-content"] } });
  if (!response.ok) throw new Error(`Site content API returned ${response.status}`);
  const payload = (await response.json()) as { content?: { site?: unknown } };
  return mergeContent(payload.content?.site);
}


export function selectGalleryMedia(media: MediaAsset[], ids: (number | string)[] | undefined, limit?: number): MediaAsset[] {
  const selected = ids === undefined
    ? media.filter((item) => item.category === "Projektaufnahmen")
    : ids.flatMap((id) => media.find((item) => String(item.id) === String(id)) ?? []);
  return limit === undefined ? selected : selected.slice(0, limit);
}

export async function getGalleryMedia(): Promise<MediaAsset[]> {
  try {
    const response = await fetchBackend("/media/public/", { cache: "no-store" });
    if (!response.ok) return [];
    const items = ((await response.json()) as { results?: MediaAsset[] }).results ?? [];
    return items.map((item) => ({ ...item, url: item.url.startsWith("/media/") ? `/api/media/${item.url.replace(/^\/media\//, "")}` : item.url }));
  } catch {
    return [];
  }
}
