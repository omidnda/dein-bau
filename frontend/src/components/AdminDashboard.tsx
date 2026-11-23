"use client";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import AdminReviews from "@/components/AdminReviews";
import { defaultContent, mergeContent, type MediaAsset, type SiteContent } from "@/content/site";

const labels: Record<string, string> = { legal: "Rechtliche Seiten", impressum: "Impressum", datenschutz: "Datenschutz", vatId: "Umsatzsteuer-ID", registerCourt: "Registergericht", registerNumber: "Registernummer", sections: "Textabschnitte", faq: "Häufige Fragen", questions: "Fragen und Antworten", home: "Startseite: weitere Inhalte", heroSecondImage: "Hero: zweites Bild", heroThirdImage: "Hero: drittes Bild", heroSecondary: "Hero: Leistungen-Button", heroProof: "Hero: Vorteile", heroImageLabel: "Hero: Bildbeschriftung", servicesEyebrow: "Leistungen: Überzeile", servicesHeading: "Leistungen: Überschrift", servicesLink: "Leistungen: Link", serviceLink: "Leistung: Link", companyEyebrow: "Über uns: Überzeile", companyHeading: "Über uns: Überschrift", companyText: "Über uns: Text", companyLink: "Über uns: Link", companyImage: "Über uns: Bild", quickLabel: "Schnellzugriff: Titel", quickContact: "Schnellzugriff: Kontakt", quickGallery: "Schnellzugriff: Galerie", quickServices: "Schnellzugriff: Leistungen", trustEyebrow: "Vorteile: Überzeile", trustHeading: "Vorteile: Überschrift", trustPoints: "Vorteile", comparisonEyebrow: "Vergleich: Überzeile", comparisonHeading: "Vergleich: Überschrift", comparisonText: "Vergleich: Text", comparisonDisclaimer: "Vergleich: Bildhinweis", processEyebrow: "Ablauf: Überzeile", processHeading: "Ablauf: Überschrift", steps: "Ablauf: Schritte", galleryEyebrow: "Galerie: Überzeile", galleryHeading: "Galerie: Überschrift", galleryLink: "Galerie: Link", reviewsEyebrow: "Bewertungen: Überzeile", reviewsHeading: "Bewertungen: Überschrift", reviewsText: "Bewertungen: Text", reviewsListHeading: "Bewertungen: Listentitel", reviewsButton: "Bewertungen: Button", contactEyebrow: "Kontakt: Überzeile", pageCopy: "Seitenüberschriften und Texte", heading: "Überschrift", projectsHeading: "Überschrift Projekte", photosHeading: "Überschrift Fotos", approachHeading: "Überschrift Anspruch", approachText: "Text Anspruch", portraitHeading: "Überschrift Ansprechpartner", portraitText: "Text Ansprechpartner", valuesHeading: "Überschrift Werte", formHeading: "Überschrift Formular", formText: "Text Formular", company: "Unternehmen", name: "Name", owner: "Inhaber/in", phone: "Telefon", email: "E-Mail", address: "Adresse", tagline: "Unterzeile", nav: "Navigation", label: "Bezeichnung", href: "Link", hero: "Startseite: Hauptbereich", eyebrow: "Überzeile", title: "Titel", text: "Text", image: "Bild", services: "Leistungen", slug: "Interne Kennung", summary: "Kurzbeschreibung", details: "Beschreibung", about: "Über uns", intro: "Einleitung", points: "Werte", gallery: "Referenzen", projects: "Referenzprojekte", aboutImage: "Bild Über uns", beforeImage: "Vorher-Bild", afterImage: "Nachher-Bild", contact: "Kontakt", button: "Buttontext" };
type Panel = { id: string; label: string; description: string; paths?: string[][] };
const panels: { group: string; items: Panel[] }[] = [
  { group: "Übersicht", items: [
    { id: "company", label: "Unternehmen & Navigation", description: "Kontaktdaten für die gesamte Website und Hauptnavigation.", paths: [["company"], ["nav"]] },
    { id: "messages", label: "Kontaktanfragen", description: "Nachrichten aus dem Kontaktformular." },
    { id: "reviews", label: "Bewertungen", description: "Bewertungen prüfen und freigeben." },
    { id: "media", label: "Medien", description: "Bilder und Videos hochladen und bearbeiten." },
  ] },
  { group: "Startseite", items: [
    { id: "home_hero", label: "Startbereich", description: "Überschrift, Einleitung und Bilder oben auf der Startseite.", paths: [["hero"], ...["heroSecondary", "heroProof", "heroImageLabel", "heroSecondImage", "heroThirdImage"].map((key) => ["home", key])] },
    { id: "home_services", label: "Leistungen & Über uns", description: "Abschnitte Leistungen und Unternehmensvorstellung auf der Startseite.", paths: ["servicesEyebrow", "servicesHeading", "servicesLink", "serviceLink", "companyEyebrow", "companyHeading", "companyText", "companyLink", "companyImage"].map((key) => ["home", key]) },
    { id: "home_trust", label: "Vorteile & Schnellzugriff", description: "Schnellzugriff und die drei Vorteile auf der Startseite.", paths: ["quickLabel", "quickContact", "quickGallery", "quickServices", "trustEyebrow", "trustHeading", "trustPoints"].map((key) => ["home", key]) },
    { id: "home_process", label: "Vergleich & Ablauf", description: "Vergleichsbilder und die Schritte des Projektablaufs.", paths: ["comparisonEyebrow", "comparisonHeading", "comparisonText", "beforeImage", "afterImage", "comparisonDisclaimer", "processEyebrow", "processHeading", "steps"].map((key) => ["home", key]) },
    { id: "home_other", label: "Galerie, Bewertungen & Kontakt", description: "Überschriften der Galerie-, Bewertungs- und Kontaktbereiche auf der Startseite.", paths: ["galleryEyebrow", "galleryHeading", "galleryLink", "reviewsEyebrow", "reviewsHeading", "reviewsText", "reviewsListHeading", "reviewsButton", "contactEyebrow"].map((key) => ["home", key]) },
  ] },
  { group: "Seiten", items: [
    { id: "services", label: "Leistungen", description: "Einleitung und Inhalte der einzelnen Leistungen.", paths: [["pageCopy", "services"], ["services"]] },
    { id: "about", label: "Über uns", description: "Texte, Werte und Porträt der Über-uns-Seite.", paths: [["pageCopy", "about"], ["about"], ["aboutImage"]] },
    { id: "gallery", label: "Referenzen", description: "Einleitung und Referenzprojekte auf der Galerie-Seite.", paths: [["pageCopy", "gallery"], ["gallery"]] },
    { id: "contact", label: "Kontakt", description: "Überschriften und Einleitung der Kontaktseite und Kontaktbereiche.", paths: [["pageCopy", "contact"], ["contact"]] },
    { id: "faq", label: "Häufige Fragen", description: "Fragen und Antworten auf der FAQ-Seite.", paths: [["faq"]] },
    { id: "impressum", label: "Impressum", description: "Registerangaben und Textabschnitte des Impressums.", paths: [["legal", "impressum"]] },
    { id: "privacy", label: "Datenschutz", description: "Textabschnitte der Datenschutzerklärung.", paths: [["legal", "datenschutz"]] },
  ] },
];
type Submission = { id: number; name: string; email: string; phone: string; service: string; message: string; status: string; createdAt: string };

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [activePanel, setActivePanel] = useState("company");
  const [messageFilter, setMessageFilter] = useState("all");
  const [messageBusy, setMessageBusy] = useState<number | null>(null);

  async function load(silentUnauthorized = false) {
    try {
      const responses = await Promise.all([fetch("/api/admin/content", { cache: "no-store" }), fetch("/api/admin/media", { cache: "no-store" }), fetch("/api/admin/submissions", { cache: "no-store" })]);
      const [contentResponse, mediaResponse, submissionsResponse] = responses;
      if (contentResponse.status === 401) {
        setLoggedIn(false); setLoaded(false);
        if (!silentUnauthorized) setNotice("Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.");
        return false;
      }
      const failed = responses.findIndex((response) => !response.ok);
      if (failed !== -1) {
        setNotice(`Daten konnten nicht geladen werden (${["Inhalte", "Medien", "Kontaktanfragen"][failed]}, HTTP ${responses[failed].status}).`);
        return false;
      }
      const data = await contentResponse.json();
      setContent(mergeContent(data.content?.site));
      setMedia((await mediaResponse.json()).results ?? []);
      setSubmissions((await submissionsResponse.json()).results ?? []);
      setNotice(""); setLoaded(true); setLoggedIn(true); return true;
    } catch { setNotice("Daten konnten nicht geladen werden. Bitte prüfen Sie die Verbindung zum Backend."); return false; }
  }
  useEffect(() => { void Promise.resolve().then(() => load(true)); }, []);
  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); setNotice(data.detail || "Anmeldung fehlgeschlagen."); return; }
      setLoggedIn(true); setLoaded(false); setLogin({ username: "", password: "" });
      await load();
    } catch { setNotice("Anmeldedienst nicht erreichbar."); } finally { setBusy(false); }
  }
  async function saveContent() {
    setBusy(true); setNotice("");
    try { const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: { site: content } }) }); setNotice(response.ok ? "Inhalt gespeichert." : "Speichern fehlgeschlagen."); } catch { setNotice("Backend nicht erreichbar."); } finally { setBusy(false); }
  }
  async function refreshMedia() { const response = await fetch("/api/admin/media", { cache: "no-store" }); if (!response.ok) throw new Error("Media unavailable"); setMedia((await response.json()).results ?? []); }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true);
    try { const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(form) }); if (response.ok) { form.reset(); await refreshMedia(); setNotice("Medium hochgeladen."); } else setNotice(`Upload fehlgeschlagen: ${(await response.json()).detail ?? response.status}`); } catch { setNotice("Upload fehlgeschlagen."); } finally { setBusy(false); }
  }
  async function changeMedia(item: MediaAsset, remove = false) {
    if (remove && !window.confirm("Dieses Medium wirklich löschen? Verknüpfte Bilder müssen danach neu ausgewählt werden.")) return;
    try { const response = await fetch(`/api/admin/media?id=${item.id}`, { method: remove ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, ...(remove ? {} : { body: JSON.stringify({ title: item.title, alt: item.alt, category: item.category, isFeatured: item.isFeatured }) }) }); if (response.ok) { await refreshMedia(); setNotice(remove ? "Medium gelöscht." : "Medium gespeichert."); } else setNotice("Medium konnte nicht gespeichert werden."); } catch { setNotice("Backend nicht erreichbar."); }
  }
  async function updateSubmission(id: number, status: string) {
    setMessageBusy(id); setNotice("");
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error();
      const updated = await response.json() as Submission;
      setSubmissions((items) => items.map((item) => item.id === id ? updated : item));
      setNotice("Status der Anfrage gespeichert.");
    } catch { setNotice("Status konnte nicht gespeichert werden."); } finally { setMessageBusy(null); }
  }
  function valueAt(path: string[]): unknown {
    return path.reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, content);
  }
  function update(path: (string | number)[], value: unknown) {
    setContent((previous) => {
      function replace(current: unknown, keys: (string | number)[]): unknown {
        if (!keys.length) return value;
        const [key, ...rest] = keys;
        if (Array.isArray(current) && typeof key === "number") return current.map((item, index) => index === key ? replace(item, rest) : item);
        if (current && typeof current === "object") { const object = current as Record<string, unknown>; return { ...object, [key]: replace(object[key], rest) }; }
        return current;
      }
      return replace(previous, path) as SiteContent;
    });
  }
  function fields(value: unknown, path: (string | number)[]): React.ReactNode {
    if (typeof value === "string") {
      const key = String(path[path.length - 1]); const label = labels[key] ?? key;
      if (key === "image" || key === "companyImage" || key === "heroSecondImage" || key === "heroThirdImage" || key === "aboutImage" || key === "beforeImage" || key === "afterImage") return <label className="admin-field" key={path.join(".")}>{label}<input value={value} onChange={(event) => update(path, event.target.value)} /><select value={media.some((item) => item.url === value) ? value : ""} onChange={(event) => { if (event.target.value) update(path, event.target.value); }}><option value="">Bild aus Medien auswählen …</option>{media.filter((item) => item.mediaType === "image").map((item) => <option key={item.id} value={item.url}>{item.title || item.name} ({item.id})</option>)}</select></label>;
      return <label className="admin-field" key={path.join(".")}>{label}{(["text", "details", "intro", "summary"].includes(key) || key.endsWith("Text")) ? <textarea rows={3} value={value} onChange={(event) => update(path, event.target.value)} /> : <input value={value} onChange={(event) => update(path, event.target.value)} />}</label>;
    }
    if (Array.isArray(value)) return <fieldset className="admin-fieldset" key={path.join(".")}><legend>{labels[String(path.at(-1))] ?? String(path.at(-1))}</legend>{value.map((item, index) => <div className="admin-array-item" key={index}><strong>{index + 1}</strong>{fields(item, [...path, index])}{["projects", "points", "questions", "sections"].includes(String(path.at(-1))) && <button type="button" className="filter" onClick={() => update(path, value.filter((_, i) => i !== index))}>Entfernen</button>}</div>)}{["projects", "points", "questions", "sections"].includes(String(path.at(-1))) && <button type="button" className="filter" onClick={() => update(path, [...value, String(path.at(-1)) === "projects" ? { title: "", text: "", beforeImage: "", afterImage: "" } : { title: "", text: "" }])}>Hinzufügen</button>}</fieldset>;
    if (value && typeof value === "object") return <fieldset className="admin-fieldset" key={path.join(".")}><legend>{labels[String(path.at(-1))] ?? String(path.at(-1))}</legend>{Object.entries(value).map(([key, item]) => fields(item, [...path, key]))}</fieldset>;
    return null;
  }
  if (!loggedIn) return <form className="admin-login" onSubmit={signIn}><p className="eyebrow">Geschützter Bereich</p><h1>Custom Admin</h1><label>Benutzername<input required value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} /></label><label>Passwort<input required type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button disabled={busy} className="button button-primary">Anmelden</button><p className="form-error">{notice}</p></form>;
  if (!loaded) return <div className="admin-login"><p className="eyebrow">Geschützter Bereich</p><h1>Custom Admin</h1><p className="form-error" role="alert">{notice || "Daten werden geladen …"}</p><button className="button button-primary" onClick={() => void load()}>Erneut laden</button> <button className="filter" onClick={() => { void fetch("/api/auth/logout", { method: "POST" }); setLoggedIn(false); setNotice(""); }}>Abmelden</button></div>;
  const panel = panels.flatMap((group) => group.items).find((item) => item.id === activePanel)!;
  const visibleMessages = messageFilter === "all" ? submissions : submissions.filter((item) => item.status === messageFilter);
  const newMessages = submissions.filter((item) => item.status === "new").length;
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-sidebar-brand"><span>DEIN BAU HUB</span><strong>Website verwalten</strong><small>Administration</small></div><nav className="admin-sidebar-nav" aria-label="Admin-Bereiche">{panels.map((group) => <div className="admin-nav-group" key={group.group}><p>{group.group}</p>{group.items.map((item) => <button type="button" key={item.id} className={activePanel === item.id ? "admin-nav-item active" : "admin-nav-item"} aria-current={activePanel === item.id ? "page" : undefined} onClick={() => { setActivePanel(item.id); setNotice(""); }}><span>{item.label}</span>{item.id === "messages" && newMessages > 0 && <b>{newMessages}</b>}</button>)}</div>)}</nav><a className="admin-site-link" href="/" target="_blank" rel="noreferrer">Website ansehen ↗</a></aside>
    <div className="admin-workspace"><div className="admin-top"><div><p className="eyebrow">DEIN BAU HUB / ADMINISTRATION</p><h1>{panel.label}</h1><p className="admin-panel-description">{panel.description}</p></div><button className="filter" onClick={() => { void fetch("/api/auth/logout", { method: "POST" }); setLoggedIn(false); setLoaded(false); }}>Abmelden</button></div><p className="admin-notice" role="status">{notice}</p>
    {panel.paths && <section className="admin-card admin-content-editor"><div><p className="eyebrow">Inhalt bearbeiten</p><h2>{panel.label}</h2><p className="muted">Änderungen bleiben beim Wechsel zwischen den Bereichen erhalten. Speichern veröffentlicht alle bearbeiteten Website-Inhalte.</p></div>{panel.paths.map((path) => fields(valueAt(path), path))}<button disabled={busy} className="button button-primary admin-save" onClick={saveContent}>Website-Inhalte speichern</button></section>}
    {activePanel === "media" && <section className="admin-card"><h2>Medien verwalten</h2><p>JPG, PNG, WebP, MP4, WebM, MOV · maximal 10 MB.</p><form className="admin-upload" onSubmit={upload}><input required type="file" name="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" /><input name="title" placeholder="Titel" /><input name="category" placeholder="Kategorie" /><input name="alt" placeholder="Alt-Text" /><label><input type="checkbox" name="isFeatured" value="true" /> Hervorheben</label><button disabled={busy} className="button button-primary">Upload</button></form><div className="admin-assets">{media.map((item) => <article className="admin-asset" key={item.id}>{item.mediaType === "image" ? <Image src={item.url} alt={item.alt || item.name} width={220} height={150} unoptimized /> : <video src={item.url} controls preload="metadata" />}<label>Titel<input value={item.title} onChange={(e) => setMedia(media.map((m) => m.id === item.id ? { ...m, title: e.target.value } : m))} /></label><label>Alt-Text<input value={item.alt} onChange={(e) => setMedia(media.map((m) => m.id === item.id ? { ...m, alt: e.target.value } : m))} /></label><label>Kategorie<input value={item.category} onChange={(e) => setMedia(media.map((m) => m.id === item.id ? { ...m, category: e.target.value } : m))} /></label><label><input type="checkbox" checked={item.isFeatured} onChange={(e) => setMedia(media.map((m) => m.id === item.id ? { ...m, isFeatured: e.target.checked } : m))} /> Hervorheben</label><div><button className="filter" onClick={() => changeMedia(item)}>Speichern</button> <button className="filter" onClick={() => changeMedia(item, true)}>Löschen</button></div></article>)}</div></section>}
    {activePanel === "reviews" && <AdminReviews />}
    {activePanel === "messages" && <section className="admin-card"><div><p className="eyebrow">Posteingang</p><h2>Kontaktanfragen</h2><p className="muted">Nachrichten aus dem Kontaktformular, nach Eingangsdatum sortiert.</p></div><div className="admin-message-filters">{[["all", "Alle"], ["new", "Neu"], ["read", "Gelesen"], ["done", "Erledigt"]].map(([value, label]) => <button type="button" key={value} className={messageFilter === value ? "filter active" : "filter"} onClick={() => setMessageFilter(value)}>{label}</button>)}</div>{visibleMessages.length === 0 ? <p>Keine Anfragen in dieser Ansicht vorhanden.</p> : visibleMessages.map((item) => <article className="admin-message" key={item.id}><div className="admin-message-header"><div><strong>{item.name}</strong><span>{item.service || "Allgemeine Anfrage"}</span></div><div><span className={`admin-message-status status-${item.status}`}>{{ new: "Neu", read: "Gelesen", done: "Erledigt" }[item.status] || item.status}</span><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</time></div></div><p className="admin-message-text">{item.message}</p><div className="admin-message-contact"><a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>{item.phone}</a>}</div><div className="admin-message-actions"><label>Status <select value={item.status} disabled={messageBusy === item.id} onChange={(event) => void updateSubmission(item.id, event.target.value)}><option value="new">Neu</option><option value="read">Gelesen</option><option value="done">Erledigt</option></select></label><a className="filter" href={`mailto:${encodeURIComponent(item.email)}`}>Antworten ↗</a></div></article>)}</section>}
    </div></div>;
}
