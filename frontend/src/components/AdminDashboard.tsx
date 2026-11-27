"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import AdminReviews from "@/components/AdminReviews";
import AdminProjects from "@/components/AdminProjects";
import LegalEditor from "@/components/LegalEditor";
import MediaPicker from "@/components/MediaPicker";
import {
  defaultContent,
  mergeContent,
  selectGalleryMedia,
  type MediaAsset,
  type ReferenceProject,
  type SiteContent,
} from "@/content/site";

const labels: Record<string, string> = {
  legal: "Rechtliche Seiten",
  impressum: "Impressum",
  datenschutz: "Datenschutz",
  vatId: "Umsatzsteuer-ID",
  registerCourt: "Registergericht",
  registerNumber: "Registernummer",
  sections: "Textabschnitte",
  faq: "Häufige Fragen",
  questions: "Fragen und Antworten",
  home: "Startseite: weitere Inhalte",
  heroSecondImage: "Hero: zweites Bild",
  heroThirdImage: "Hero: drittes Bild",
  heroSecondary: "Hero: Leistungen-Button",
  heroProof: "Hero: Vorteile",
  heroImageLabel: "Hero: Bildbeschriftung",
  servicesEyebrow: "Leistungen: Überzeile",
  servicesHeading: "Leistungen: Überschrift",
  servicesLink: "Leistungen: Link",
  serviceLink: "Leistung: Link",
  companyEyebrow: "Über uns: Überzeile",
  companyHeading: "Über uns: Überschrift",
  companyText: "Über uns: Text",
  companyLink: "Über uns: Link",
  companyImage: "Über uns: Bild",
  quickLabel: "Schnellzugriff: Titel",
  quickContact: "Schnellzugriff: Kontakt",
  quickGallery: "Schnellzugriff: Galerie",
  quickServices: "Schnellzugriff: Leistungen",
  trustEyebrow: "Vorteile: Überzeile",
  trustHeading: "Vorteile: Überschrift",
  trustPoints: "Vorteile",
  comparisonEyebrow: "Vergleich: Überzeile",
  comparisonHeading: "Vergleich: Überschrift",
  comparisonText: "Vergleich: Text",
  comparisonDisclaimer: "Vergleich: Bildhinweis",
  processEyebrow: "Ablauf: Überzeile",
  processHeading: "Ablauf: Überschrift",
  steps: "Ablauf: Schritte",
  galleryEyebrow: "Galerie: Überzeile",
  galleryHeading: "Galerie: Überschrift",
  galleryLink: "Galerie: Link",
  reviewsEyebrow: "Bewertungen: Überzeile",
  reviewsHeading: "Bewertungen: Überschrift",
  reviewsText: "Bewertungen: Text",
  reviewsListHeading: "Bewertungen: Listentitel",
  reviewsButton: "Bewertungen: Button",
  contactEyebrow: "Kontakt: Überzeile",
  pageCopy: "Seitenüberschriften und Texte",
  heading: "Überschrift",
  projectsHeading: "Überschrift Projekte",
  photosHeading: "Überschrift Fotos",
  approachHeading: "Überschrift Anspruch",
  approachText: "Text Anspruch",
  portraitHeading: "Überschrift Ansprechpartner",
  portraitText: "Text Ansprechpartner",
  valuesHeading: "Überschrift Werte",
  formHeading: "Überschrift Formular",
  formText: "Text Formular",
  company: "Unternehmen",
  name: "Name",
  owner: "Inhaber/in",
  phone: "Telefon",
  email: "E-Mail",
  address: "Adresse",
  tagline: "Unterzeile",
  nav: "Navigation",
  label: "Bezeichnung",
  href: "Link",
  hero: "Startseite: Hauptbereich",
  eyebrow: "Überzeile",
  title: "Titel",
  text: "Text",
  image: "Bild",
  services: "Leistungen",
  slug: "URL-Kennung",
  summary: "Kurzbeschreibung",
  details: "Beschreibung",
  about: "Über uns",
  intro: "Einleitung",
  points: "Werte",
  gallery: "Referenzen",
  projects: "Referenzprojekte",
  aboutImage: "Bild Über uns",
  beforeImage: "Vorher-Bild",
  afterImage: "Nachher-Bild",
  contact: "Kontakt",
  button: "Buttontext",
};
type Panel = {
  id: string;
  label: string;
  description: string;
  paths?: string[][];
};
const panels: { group: string; items: Panel[] }[] = [
  {
    group: "Übersicht",
    items: [
      {
        id: "company",
        label: "Unternehmen & Navigation",
        description:
          "Kontaktdaten für die gesamte Website und Hauptnavigation.",
        paths: [["company"], ["nav"]],
      },
      {
        id: "messages",
        label: "Kontaktanfragen",
        description: "Nachrichten aus dem Kontaktformular.",
      },
      {
        id: "reviews",
        label: "Bewertungen",
        description: "Bewertungen prüfen und freigeben.",
      },
      {
        id: "media",
        label: "Medien",
        description:
          "Dateien hochladen und verwalten. Ordnen Sie sie anschließend einem Bereich der Website zu.",
      },
    ],
  },
  {
    group: "Startseite",
    items: [
      {
        id: "home_hero",
        label: "Startbereich",
        description:
          "Überschrift, Einleitung und Bilder oben auf der Startseite.",
        paths: [
          ["hero"],
          ...[
            "heroSecondary",
            "heroProof",
            "heroImageLabel",
            "heroSecondImage",
            "heroThirdImage",
          ].map((key) => ["home", key]),
        ],
      },
      {
        id: "home_services",
        label: "Leistungskarten",
        description:
          "Überschriften und Links des Leistungsbereichs auf der Startseite. Die einzelnen Leistungen und ihre Bilder bearbeiten Sie unter Seiten → Leistungen.",
        paths: [
          "servicesEyebrow",
          "servicesHeading",
          "servicesLink",
          "serviceLink",
        ].map((key) => ["home", key]),
      },
      {
        id: "home_company",
        label: "Unternehmensvorstellung",
        description: "Text und Bild im Über-uns-Abschnitt auf der Startseite.",
        paths: [
          "companyEyebrow",
          "companyHeading",
          "companyText",
          "companyLink",
          "companyImage",
        ].map((key) => ["home", key]),
      },
      {
        id: "home_quick",
        label: "Schnellzugriff",
        description:
          "Links direkt unter der Unternehmensvorstellung auf der Startseite.",
        paths: [
          "quickLabel",
          "quickContact",
          "quickGallery",
          "quickServices",
        ].map((key) => ["home", key]),
      },
      {
        id: "home_trust",
        label: "Vorteile",
        description: "Die drei Vorteile auf der Startseite.",
        paths: ["trustEyebrow", "trustHeading", "trustPoints"].map((key) => [
          "home",
          key,
        ]),
      },
      {
        id: "home_comparison",
        label: "Bildvergleich",
        description: "Bilder und Texte des Vergleichs auf der Startseite.",
        paths: [
          "comparisonEyebrow",
          "comparisonHeading",
          "comparisonText",
          "beforeImage",
          "afterImage",
          "comparisonDisclaimer",
        ].map((key) => ["home", key]),
      },
      {
        id: "home_process",
        label: "Projektablauf",
        description:
          "Überschrift und Schritte des Projektablaufs auf der Startseite.",
        paths: ["processEyebrow", "processHeading", "steps"].map((key) => [
          "home",
          key,
        ]),
      },
      {
        id: "home_gallery",
        label: "Referenz-Vorschau",
        description:
          "Bilder und Texte der Referenz-Vorschau auf der Startseite. Die Auswahl ist unabhängig von der Referenzseite.",
        paths: ["galleryEyebrow", "galleryHeading", "galleryLink"].map(
          (key) => ["home", key],
        ),
      },
      {
        id: "home_reviews",
        label: "Bewertungen",
        description: "Texte im Bewertungsbereich der Startseite.",
        paths: [
          "reviewsEyebrow",
          "reviewsHeading",
          "reviewsText",
          "reviewsListHeading",
          "reviewsButton",
        ].map((key) => ["home", key]),
      },
      {
        id: "home_contact",
        label: "Kontaktbereich",
        description:
          "Überzeile des Kontaktbereichs auf der Startseite. Gemeinsame Kontakttexte finden Sie unter Seiten → Kontakt.",
        paths: [["home", "contactEyebrow"]],
      },
    ],
  },
  {
    group: "Seiten",
    items: [
      {
        id: "services",
        label: "Leistungen",
        description:
          "Einleitung sowie Leistungen und Bilder. Diese Leistungen erscheinen auf der Startseite und der Leistungsseite.",
        paths: [["pageCopy", "services"], ["services"]],
      },
      {
        id: "about",
        label: "Über uns",
        description: "Texte, Werte und Porträt der Über-uns-Seite.",
        paths: [["pageCopy", "about"], ["about"], ["aboutImage"]],
      },
      {
        id: "gallery",
        label: "Referenzen",
        description: "Projektverwaltung für die Referenzseite.",
        paths: [["pageCopy", "gallery"], ["gallery"]],
      },
      {
        id: "contact",
        label: "Kontakt",
        description:
          "Überschriften und Einleitung der Kontaktseite und Kontaktbereiche.",
        paths: [["pageCopy", "contact"], ["contact"]],
      },
      {
        id: "faq",
        label: "Häufige Fragen",
        description: "Fragen und Antworten auf der FAQ-Seite.",
        paths: [["faq"]],
      },
      {
        id: "impressum",
        label: "Impressum",
        description: "Registerangaben und Textabschnitte des Impressums.",
        paths: [["legal", "impressum"]],
      },
      {
        id: "privacy",
        label: "Datenschutz",
        description: "Textabschnitte der Datenschutzerklärung.",
        paths: [["legal", "datenschutz"]],
      },
    ],
  },
];
type Submission = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
};

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
  const [galleryUploadDescription, setGalleryUploadDescription] = useState("");
  const [messageFilter, setMessageFilter] = useState("all");
  const [legalDirty, setLegalDirty] = useState(false);
  const reportLegalDirty = useCallback(
    (dirty: boolean) => setLegalDirty(dirty),
    [],
  );
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (legalDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [legalDirty]);
  const [messageBusy, setMessageBusy] = useState<number | null>(null);

  async function load(silentUnauthorized = false) {
    try {
      const responses = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/media", { cache: "no-store" }),
        fetch("/api/admin/submissions", { cache: "no-store" }),
      ]);
      const [contentResponse, mediaResponse, submissionsResponse] = responses;
      if (contentResponse.status === 401) {
        setLoggedIn(false);
        setLoaded(false);
        if (!silentUnauthorized)
          setNotice(
            "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
          );
        return false;
      }
      const failed = responses.findIndex((response) => !response.ok);
      if (failed !== -1) {
        setNotice(
          `Daten konnten nicht geladen werden (${["Inhalte", "Medien", "Kontaktanfragen"][failed]}, HTTP ${responses[failed].status}).`,
        );
        return false;
      }
      const data = await contentResponse.json();
      setContent(mergeContent(data.content?.site));
      setMedia((await mediaResponse.json()).results ?? []);
      setSubmissions((await submissionsResponse.json()).results ?? []);
      setNotice("");
      setLoaded(true);
      setLoggedIn(true);
      return true;
    } catch {
      setNotice(
        "Daten konnten nicht geladen werden. Bitte prüfen Sie die Verbindung zum Backend.",
      );
      return false;
    }
  }
  useEffect(() => {
    void Promise.resolve().then(() => load(true));
  }, []);
  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setNotice(data.detail || "Anmeldung fehlgeschlagen.");
        return;
      }
      setLoggedIn(true);
      setLoaded(false);
      setLogin({ username: "", password: "" });
      await load();
    } catch {
      setNotice("Anmeldedienst nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  }
  async function saveContent() {
    const serviceSlugs = content.services.map((service) => service.slug.trim());
    if (
      content.services.some(
        (service) => !service.title.trim() || !service.slug.trim(),
      ) ||
      new Set(serviceSlugs).size !== serviceSlugs.length
    ) {
      setNotice(
        "Bitte geben Sie für jede Leistung einen Titel und eine eindeutige URL-Kennung ein.",
      );
      return;
    }
    setBusy(true);
    setNotice("");
    const next = {
      ...content,
      home: {
        ...content.home,
        galleryMediaIds:
          content.home.galleryMediaIds ??
          selectGalleryMedia(media, undefined, 3).map((item) => item.id),
      },
      gallery: {
        ...content.gallery,
        mediaIds:
          content.gallery.mediaIds ??
          selectGalleryMedia(media, undefined).map((item) => item.id),
      },
    };
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { site: next } }),
      });
      if (response.ok)
        setContent((current) => ({
          ...current,
          home: {
            ...current.home,
            galleryMediaIds:
              current.home.galleryMediaIds ?? next.home.galleryMediaIds,
          },
          gallery: {
            ...current.gallery,
            mediaIds: current.gallery.mediaIds ?? next.gallery.mediaIds,
          },
        }));
      setNotice(
        response.ok ? "Inhalt gespeichert." : "Speichern fehlgeschlagen.",
      );
    } catch {
      setNotice("Backend nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  }
  async function refreshMedia() {
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    if (!response.ok) throw new Error("Media unavailable");
    setMedia((await response.json()).results ?? []);
  }
  async function changeMedia(item: MediaAsset, remove = false) {
    if (
      remove &&
      !window.confirm(
        "Dieses Medium wirklich löschen? Verknüpfte Bilder müssen danach neu ausgewählt werden.",
      )
    )
      return;
    try {
      const response = await fetch(`/api/admin/media?id=${item.id}`, {
        method: remove ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        ...(remove
          ? {}
          : {
              body: JSON.stringify({
                title: item.title,
                alt: item.alt,
                category: item.category,
                isFeatured: item.isFeatured,
              }),
            }),
      });
      if (response.ok) {
        await refreshMedia();
        setNotice(remove ? "Medium gelöscht." : "Medium gespeichert.");
      } else setNotice("Medium konnte nicht gespeichert werden.");
    } catch {
      setNotice("Backend nicht erreichbar.");
    }
  }
  async function updateSubmission(id: number, status: string) {
    setMessageBusy(id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      const updated = (await response.json()) as Submission;
      setSubmissions((items) =>
        items.map((item) => (item.id === id ? updated : item)),
      );
      setNotice("Status der Anfrage gespeichert.");
    } catch {
      setNotice("Status konnte nicht gespeichert werden.");
    } finally {
      setMessageBusy(null);
    }
  }
  async function deleteSubmission(id: number) {
    if (!window.confirm("Diese Kontaktanfrage endgültig löschen?")) return;
    setMessageBusy(id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setSubmissions((items) => items.filter((item) => item.id !== id));
      setNotice("Kontaktanfrage gelöscht.");
    } catch {
      setNotice("Kontaktanfrage konnte nicht gelöscht werden.");
    } finally {
      setMessageBusy(null);
    }
  }
  function valueAt(path: string[]): unknown {
    return path.reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      content,
    );
  }
  function update(path: (string | number)[], value: unknown) {
    setContent((previous) => {
      function replace(current: unknown, keys: (string | number)[]): unknown {
        if (!keys.length) return value;
        const [key, ...rest] = keys;
        if (Array.isArray(current) && typeof key === "number")
          return current.map((item, index) =>
            index === key ? replace(item, rest) : item,
          );
        if (current && typeof current === "object") {
          const object = current as Record<string, unknown>;
          return { ...object, [key]: replace(object[key], rest) };
        }
        return current;
      }
      return replace(previous, path) as SiteContent;
    });
  }
  function fields(value: unknown, path: (string | number)[]): React.ReactNode {
    if (typeof value === "string") {
      const key = String(path[path.length - 1]);
      const galleryLabels: Record<string, string> = {
        "pageCopy.gallery.heading": "Hauptüberschrift ganz oben",
        "pageCopy.gallery.projectsHeading":
          "Überschrift über den Projektkarten",
        "pageCopy.gallery.photosHeading":
          "Überschrift über der allgemeinen Fotogalerie",
        "gallery.intro": "Einleitung unter der Hauptüberschrift",
      };
      const label =
        galleryLabels[path.join(".")] ??
        (path[0] === "services" && key === "image"
          ? "Bild dieser Leistung (Startseite und Leistungsseite)"
          : (labels[key] ?? key));
      if (
        [
          "image",
          "companyImage",
          "heroSecondImage",
          "heroThirdImage",
          "aboutImage",
          "beforeImage",
          "afterImage",
        ].includes(key)
      )
        return (
          <MediaPicker
            key={path.join(".")}
            label={label}
            kind="image"
            value={value}
            media={media}
            onChange={(url) => update(path, url)}
            onUploaded={(asset) => setMedia((items) => [asset, ...items])}
          />
        );
      return (
        <label className="admin-field" key={path.join(".")}>
          {label}
          {["text", "details", "intro", "summary"].includes(key) ||
          key.endsWith("Text") ? (
            <textarea
              rows={3}
              value={value}
              onChange={(event) => update(path, event.target.value)}
            />
          ) : (
            <input
              value={value}
              onChange={(event) => update(path, event.target.value)}
            />
          )}
        </label>
      );
    }
    if (Array.isArray(value) && path.join(".") === "gallery.projects")
      return (
        <fieldset className="admin-fieldset" key={path.join(".")}>
          <legend>Referenzprojekte</legend>
          {value.map((item, index) => {
            const projects = value as unknown[];
            const project = item as ReferenceProject;
            const projectIds = project.mediaIds ?? [];
            const projectMedia = selectGalleryMedia(media, projectIds);
            function addMedia(asset: MediaAsset) {
              if (!projectIds.some((id) => String(id) === String(asset.id)))
                update([...path, index, "mediaIds"], [...projectIds, asset.id]);
            }
            function moveMedia(position: number, direction: number) {
              const next = [...projectIds];
              const target = position + direction;
              [next[position], next[target]] = [next[target], next[position]];
              update([...path, index, "mediaIds"], next);
            }
            function move(direction: number) {
              const next = [...projects];
              const target = index + direction;
              [next[index], next[target]] = [next[target], next[index]];
              update(path, next);
            }
            return (
              <details className="admin-project" key={index}>
                <summary className="admin-project-summary">
                  <span>
                    <small>PROJEKT {index + 1}</small>
                    <strong>{project.title || "Neues Projekt"}</strong>
                    <small>
                      {projectIds.length} Bilder / Videos ·{" "}
                      {project.beforeImage && project.afterImage
                        ? "Vorher-Nachher vorhanden"
                        : "Kein vollständiger Vorher-Nachher-Vergleich"}
                    </small>
                  </span>
                  <span aria-hidden="true">⌄</span>
                </summary>
                <div className="admin-project-content">
                  <div className="admin-project-head">
                    <strong>Projekt bearbeiten</strong>
                    <div className="media-actions">
                      <button
                        type="button"
                        className="filter"
                        disabled={index === 0}
                        onClick={() => move(-1)}
                      >
                        Nach oben
                      </button>
                      <button
                        type="button"
                        className="filter"
                        disabled={index === value.length - 1}
                        onClick={() => move(1)}
                      >
                        Nach unten
                      </button>
                      <button
                        type="button"
                        className="filter"
                        onClick={() =>
                          update(
                            path,
                            value.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Projekt entfernen
                      </button>
                    </div>
                  </div>
                  <div className="admin-project-group-heading">
                    <strong>1. Projektinformationen</strong>
                    <p className="admin-project-hint">
                      Titel und Beschreibung erscheinen zusammen mit den
                      zugeordneten Bildern und Videos. Ohne mindestens ein Bild,
                      Video oder vollständiges Vorher-Nachher-Paar wird das
                      Projekt auf der Website nicht angezeigt.
                    </p>
                  </div>
                  <label className="admin-field">
                    Titel
                    <input
                      value={project.title}
                      onChange={(event) =>
                        update([...path, index, "title"], event.target.value)
                      }
                    />
                  </label>
                  <label className="admin-field">
                    Beschreibung
                    <textarea
                      rows={3}
                      value={project.text}
                      onChange={(event) =>
                        update([...path, index, "text"], event.target.value)
                      }
                    />
                  </label>
                  <div className="admin-project-group-heading">
                    <strong>
                      2. Vorher und Nachher <span>optional</span>
                    </strong>
                    <p className="admin-project-hint">
                      Diese beiden Bilder erscheinen als verschiebbarer
                      Vergleich in dieser Projektkarte. Bitte zwei Aufnahmen
                      desselben Projekts wählen; beide Bilder sind erforderlich.
                    </p>
                  </div>
                  <div className="admin-project-images">
                    {(["beforeImage", "afterImage"] as const).map((key) => (
                      <MediaPicker
                        key={key}
                        label={
                          key === "beforeImage" ? "Vorher-Bild" : "Nachher-Bild"
                        }
                        kind="image"
                        value={project[key] ?? ""}
                        media={media}
                        onChange={(url) => update([...path, index, key], url)}
                        onUploaded={(asset) =>
                          setMedia((items) => [asset, ...items])
                        }
                      />
                    ))}
                  </div>
                  <div className="admin-project-album">
                    <div className="admin-project-group-heading">
                      <strong>
                        3. Weitere Bilder und Videos <span>optional</span>
                      </strong>
                      <p className="admin-project-hint">
                        Diese Dateien erscheinen im Slider dieser Projektkarte.
                        Die Pfeile ändern ihre Reihenfolge.
                      </p>
                    </div>
                    <MediaPicker
                      label="Bild oder Video zum Projekt hinzufügen"
                      kind="both"
                      media={media}
                      onChange={(url) => {
                        const asset = media.find(
                          (candidate) => candidate.url === url,
                        );
                        if (asset) addMedia(asset);
                      }}
                      onUploaded={(asset) => {
                        setMedia((items) => [asset, ...items]);
                        addMedia(asset);
                      }}
                    />
                    <div className="admin-project-media-list">
                      {projectIds.map((id, position) => {
                        const asset = projectMedia.find(
                          (entry) => String(entry.id) === String(id),
                        );
                        return (
                          <div
                            className="admin-project-media-item"
                            key={`${id}-${position}`}
                          >
                            {asset ? (
                              asset.mediaType === "video" ? (
                                <video src={asset.url} preload="metadata" />
                              ) : (
                                <Image
                                  src={asset.url}
                                  alt=""
                                  width={100}
                                  height={70}
                                  unoptimized
                                />
                              )
                            ) : (
                              <span>Datei nicht mehr verfügbar</span>
                            )}
                            <span>
                              {asset?.title || asset?.name || `ID ${id}`}
                            </span>
                            <div className="media-actions">
                              <button
                                type="button"
                                className="filter"
                                disabled={position === 0}
                                onClick={() => moveMedia(position, -1)}
                                aria-label="Datei nach oben"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="filter"
                                disabled={position === projectIds.length - 1}
                                onClick={() => moveMedia(position, 1)}
                                aria-label="Datei nach unten"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                className="filter"
                                onClick={() =>
                                  update(
                                    [...path, index, "mediaIds"],
                                    projectIds.filter(
                                      (_, itemIndex) => itemIndex !== position,
                                    ),
                                  )
                                }
                              >
                                Entfernen
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
          <button
            type="button"
            className="filter"
            onClick={() =>
              update(path, [
                ...value,
                {
                  title: "",
                  text: "",
                  beforeImage: "",
                  afterImage: "",
                  mediaIds: [],
                },
              ])
            }
          >
            Projekt hinzufügen und unten öffnen
          </button>
        </fieldset>
      );
    if (Array.isArray(value))
      return (
        <fieldset className="admin-fieldset" key={path.join(".")}>
          <legend>{labels[String(path.at(-1))] ?? String(path.at(-1))}</legend>
          {path.join(".") === "services" && (
            <p>
              Diese Liste bestimmt Anzahl und Reihenfolge der Leistungen auf der
              Startseite und der Leistungsseite. Änderungen werden nach dem
              Speichern veröffentlicht.
            </p>
          )}
          {value.map((item, index) => (
            <div className="admin-array-item" key={index}>
              <strong>
                {path.join(".") === "services" &&
                item &&
                typeof item === "object" &&
                "title" in item
                  ? String(item.title) || `Leistung ${index + 1}`
                  : index + 1}
              </strong>
              {fields(item, [...path, index])}
              {path.join(".") === "services" && (
                <div>
                  <button
                    type="button"
                    className="filter"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...value];
                      [next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ];
                      update(path, next);
                    }}
                  >
                    Nach oben
                  </button>{" "}
                  <button
                    type="button"
                    className="filter"
                    disabled={index === value.length - 1}
                    onClick={() => {
                      const next = [...value];
                      [next[index], next[index + 1]] = [
                        next[index + 1],
                        next[index],
                      ];
                      update(path, next);
                    }}
                  >
                    Nach unten
                  </button>{" "}
                  <button
                    type="button"
                    className="filter"
                    onClick={() =>
                      update(
                        path,
                        value.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Leistung entfernen
                  </button>
                </div>
              )}
              {["projects", "points", "questions", "sections"].includes(
                String(path.at(-1)),
              ) && (
                <button
                  type="button"
                  className="filter"
                  onClick={() =>
                    update(
                      path,
                      value.filter((_, i) => i !== index),
                    )
                  }
                >
                  Entfernen
                </button>
              )}
            </div>
          ))}
          {path.join(".") === "services" && (
            <button
              type="button"
              className="filter"
              onClick={() => {
                let number = 1;
                while (
                  content.services.some(
                    (service) => service.slug === `neue-leistung-${number}`,
                  )
                )
                  number++;
                update(path, [
                  ...value,
                  {
                    slug: `neue-leistung-${number}`,
                    title: "",
                    summary: "",
                    details: "",
                    image: "",
                  },
                ]);
              }}
            >
              Leistung hinzufügen
            </button>
          )}
          {["projects", "points", "questions", "sections"].includes(
            String(path.at(-1)),
          ) && (
            <button
              type="button"
              className="filter"
              onClick={() =>
                update(path, [
                  ...value,
                  String(path.at(-1)) === "projects"
                    ? { title: "", text: "", beforeImage: "", afterImage: "" }
                    : { title: "", text: "" },
                ])
              }
            >
              Hinzufügen
            </button>
          )}
        </fieldset>
      );
    if (value && typeof value === "object")
      return (
        <fieldset className="admin-fieldset" key={path.join(".")}>
          <legend>{labels[String(path.at(-1))] ?? String(path.at(-1))}</legend>
          {Object.entries(value)
            .filter(
              ([key]) =>
                !(
                  path.join(".") === "gallery" &&
                  (key === "mediaIds" || key === "mediaDescriptions")
                ),
            )
            .map(([key, item]) => fields(item, [...path, key]))}
        </fieldset>
      );
    return null;
  }
  function gallerySelection(home: boolean) {
    const path = home ? ["home", "galleryMediaIds"] : ["gallery", "mediaIds"];
    const ids = home ? content.home.galleryMediaIds : content.gallery.mediaIds;
    const selected = selectGalleryMedia(media, ids, home ? 3 : undefined);
    function setSelected(next: MediaAsset[]) {
      update(
        path,
        next.map((item) => item.id),
      );
    }
    return (
      <fieldset className="admin-fieldset admin-gallery-selection">
        <legend>
          {home ? "Bilder auf der Startseite" : "Bilder auf der Referenzseite"}
        </legend>
        <p className="muted">
          {home
            ? "Wählen Sie bis zu drei Bilder oder Videos für die Startseite. Diese Auswahl ist unabhängig von der Referenzseite."
            : "Wählen Sie die Bilder und Videos für die Referenzseite. Uploads erscheinen nicht automatisch auf der Website."}{" "}
          Änderungen werden mit den Website-Inhalten gespeichert.
        </p>
        {ids === undefined && (
          <p className="admin-selection-note">
            Bisherige Projektaufnahmen sind vorausgewählt. Prüfen Sie die
            Auswahl und speichern Sie sie.
          </p>
        )}
        {!home && (
          <label className="admin-field">
            Beschreibung für den nächsten Upload (optional)
            <textarea
              rows={3}
              value={galleryUploadDescription}
              onChange={(event) =>
                setGalleryUploadDescription(event.target.value)
              }
              placeholder="Beschreibung, die unter diesem Bild oder Video auf der Referenzseite erscheint"
            />
            <small>
              Gilt nur für die nächste hochgeladene Datei. Bereits ausgewählte
              Dateien können Sie unten bearbeiten.
            </small>
          </label>
        )}
        <MediaPicker
          label="Datei für diesen Bereich hochladen"
          kind="both"
          media={media}
          onUploaded={(asset) => {
            setMedia((items) => [asset, ...items]);
            if (!home || selected.length < 3) {
              setSelected([...selected, asset]);
              if (!home && galleryUploadDescription.trim())
                update(["gallery", "mediaDescriptions"], {
                  ...content.gallery.mediaDescriptions,
                  [String(asset.id)]: galleryUploadDescription,
                });
              if (!home) setGalleryUploadDescription("");
            } else
              setNotice(
                "Datei hochgeladen. Entfernen Sie zuerst ein Bild aus der Startseiten-Auswahl.",
              );
          }}
        />
        <div className="admin-selection-grid">
          {media.map((item) => {
            const checked = selected.some(
              (chosen) => String(chosen.id) === String(item.id),
            );
            return (
              <label
                className={
                  checked
                    ? "admin-selection-item selected"
                    : "admin-selection-item"
                }
                key={item.id}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!checked && home && selected.length >= 3}
                  onChange={() =>
                    setSelected(
                      checked
                        ? selected.filter(
                            (chosen) => String(chosen.id) !== String(item.id),
                          )
                        : [...selected, item],
                    )
                  }
                />
                {item.mediaType === "video" ? (
                  <video src={item.url} preload="metadata" />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    width={180}
                    height={110}
                    unoptimized
                  />
                )}
                <span>{item.title || item.name}</span>
              </label>
            );
          })}
        </div>
        {!home && selected.length > 0 && (
          <div className="admin-gallery-descriptions">
            <strong>Beschreibungen der ausgewählten Dateien</strong>
            <p className="admin-project-hint">
              Optional. Der Text erscheint unter der jeweiligen Datei auf der
              Referenzseite. Anschließend Website-Inhalte speichern.
            </p>
            {selected.map((item) => (
              <div className="admin-gallery-description" key={item.id}>
                {item.mediaType === "video" ? (
                  <video src={item.url} preload="metadata" />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    width={100}
                    height={70}
                    unoptimized
                  />
                )}
                <label className="admin-field">
                  Beschreibung: {item.title || item.name}
                  <textarea
                    rows={2}
                    value={
                      content.gallery.mediaDescriptions?.[String(item.id)] ?? ""
                    }
                    onChange={(event) =>
                      update(["gallery", "mediaDescriptions"], {
                        ...content.gallery.mediaDescriptions,
                        [String(item.id)]: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        )}
        {media.length === 0 && (
          <p>Noch keine Dateien in der Mediathek vorhanden.</p>
        )}
        <small>
          {selected.length}
          {home ? " / 3" : ""} ausgewählt
        </small>
      </fieldset>
    );
  }
  if (!loggedIn)
    return (
      <form className="admin-login" onSubmit={signIn}>
        <p className="eyebrow">Geschützter Bereich</p>
        <h1>Custom Admin</h1>
        <label>
          Benutzername
          <input
            required
            value={login.username}
            onChange={(event) =>
              setLogin({ ...login, username: event.target.value })
            }
          />
        </label>
        <label>
          Passwort
          <input
            required
            type="password"
            value={login.password}
            onChange={(event) =>
              setLogin({ ...login, password: event.target.value })
            }
          />
        </label>
        <button disabled={busy} className="button button-primary">
          Anmelden
        </button>
        <p className="form-error">{notice}</p>
      </form>
    );
  if (!loaded)
    return (
      <div className="admin-login">
        <p className="eyebrow">Geschützter Bereich</p>
        <h1>Custom Admin</h1>
        <p className="form-error" role="alert">
          {notice || "Daten werden geladen …"}
        </p>
        <button className="button button-primary" onClick={() => void load()}>
          Erneut laden
        </button>{" "}
        <button
          className="filter"
          onClick={() => {
            void fetch("/api/auth/logout", { method: "POST" });
            setLoggedIn(false);
            setNotice("");
          }}
        >
          Abmelden
        </button>
      </div>
    );
  const panel = panels
    .flatMap((group) => group.items)
    .find((item) => item.id === activePanel)!;
  const visibleMessages =
    messageFilter === "all"
      ? submissions
      : submissions.filter((item) => item.status === messageFilter);
  const newMessages = submissions.filter(
    (item) => item.status === "new",
  ).length;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>DEIN BAU HUB</span>
          <strong>Website verwalten</strong>
          <small>Administration</small>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin-Bereiche">
          {panels.map((group) => (
            <div className="admin-nav-group" key={group.group}>
              <p>{group.group}</p>
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    activePanel === item.id
                      ? "admin-nav-item active"
                      : "admin-nav-item"
                  }
                  aria-current={activePanel === item.id ? "page" : undefined}
                  onClick={() => {
                    if (
                      item.id !== activePanel &&
                      legalDirty &&
                      !window.confirm(
                        "Sie haben ungespeicherte Änderungen. Möchten Sie den Bereich wirklich verlassen?",
                      )
                    )
                      return;
                    setActivePanel(item.id);
                    setNotice("");
                  }}
                >
                  <span>{item.label}</span>
                  {item.id === "messages" && newMessages > 0 && (
                    <b>{newMessages}</b>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <a
          className="admin-site-link"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Website ansehen ↗
        </a>
      </aside>
      <div className="admin-workspace">
        <div className="admin-top">
          <div>
            <p className="eyebrow">DEIN BAU HUB / ADMINISTRATION</p>
            <h1>{panel.label}</h1>
            <p className="admin-panel-description">{panel.description}</p>
            {panel.paths && (
              <a
                className="admin-preview-link"
                href={
                  activePanel.startsWith("home_")
                    ? `/#${({ home_hero: "start", home_services: "leistungen", home_company: "unternehmen", home_quick: "schnellzugriff", home_trust: "vorteile", home_comparison: "vergleich", home_process: "ablauf", home_gallery: "referenzen", home_reviews: "bewertungen", home_contact: "kontakt" } as Record<string, string>)[activePanel] ?? "start"}`
                    : ((
                        {
                          services: "/leistungen",
                          about: "/ueber-uns",
                          gallery: "/gallery",
                          contact: "/kontakt",
                          faq: "/faq",
                          impressum: "/impressum",
                          privacy: "/datenschutz",
                        } as Record<string, string>
                      )[activePanel] ?? "/")
                }
                target="_blank"
                rel="noreferrer"
              >
                Diesen Bereich auf der Website ansehen ↗
              </a>
            )}
          </div>
          <button
            className="filter"
            onClick={() => {
              if (
                legalDirty &&
                !window.confirm(
                  "Sie haben ungespeicherte Änderungen. Möchten Sie sich wirklich abmelden?",
                )
              )
                return;
              void fetch("/api/auth/logout", { method: "POST" });
              setLoggedIn(false);
              setLoaded(false);
            }}
          >
            Abmelden
          </button>
        </div>
        <p className="admin-notice" role="status">
          {notice}
        </p>
        {(activePanel === "impressum" || activePanel === "privacy") && (
          <LegalEditor
            key={activePanel}
            kind={activePanel === "impressum" ? "impressum" : "datenschutz"}
            document={
              content.legal[
                activePanel === "impressum" ? "impressum" : "datenschutz"
              ]
            }
            onDirty={reportLegalDirty}
            onSave={async (document) => {
              const kind =
                activePanel === "impressum" ? "impressum" : "datenschutz";
              const next = {
                ...content,
                legal: { ...content.legal, [kind]: document },
              } as SiteContent;
              try {
                const response = await fetch("/api/admin/content", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content: { site: next } }),
                });
                if (!response.ok) return false;
                setContent(next);
                return true;
              } catch {
                return false;
              }
            }}
          />
        )}
        {panel.paths &&
          activePanel !== "gallery" &&
          activePanel !== "impressum" &&
          activePanel !== "privacy" && (
            <section className="admin-card admin-content-editor">
              <div>
                <p className="eyebrow">Inhalt bearbeiten</p>
                <h2>{panel.label}</h2>
                <p className="muted">
                  Änderungen bleiben beim Wechsel zwischen den Bereichen
                  erhalten. Speichern veröffentlicht alle bearbeiteten
                  Website-Inhalte.
                </p>
              </div>
              {panel.paths.map((path) => fields(valueAt(path), path))}
              {activePanel === "home_gallery" && gallerySelection(true)}
              <button
                disabled={busy}
                className="button button-primary admin-save"
                onClick={saveContent}
              >
                Website-Inhalte speichern
              </button>
            </section>
          )}
        {activePanel === "gallery" && <AdminProjects media={media} onUploaded={(asset) => setMedia((items) => [asset, ...items])} />}
        {activePanel === "media" && (
          <section className="admin-card">
            <h2>Medien verwalten</h2>
            <MediaPicker
              label="Bild oder Video hinzufügen"
              kind="both"
              media={media}
              onUploaded={(asset) => {
                setMedia((items) => [asset, ...items]);
                setNotice("Medium hochgeladen.");
              }}
            />
            <div className="admin-assets">
              {media.map((item) => (
                <article className="admin-asset" key={item.id}>
                  {item.mediaType === "image" ? (
                    <Image
                      src={item.url}
                      alt={item.alt || item.name}
                      width={220}
                      height={150}
                      unoptimized
                    />
                  ) : (
                    <video src={item.url} controls preload="metadata" />
                  )}
                  <label>
                    Titel
                    <input
                      value={item.title}
                      onChange={(e) =>
                        setMedia(
                          media.map((m) =>
                            m.id === item.id
                              ? { ...m, title: e.target.value }
                              : m,
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    Alt-Text
                    <input
                      value={item.alt}
                      onChange={(e) =>
                        setMedia(
                          media.map((m) =>
                            m.id === item.id
                              ? { ...m, alt: e.target.value }
                              : m,
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    Kategorie
                    <input
                      value={item.category}
                      onChange={(e) =>
                        setMedia(
                          media.map((m) =>
                            m.id === item.id
                              ? { ...m, category: e.target.value }
                              : m,
                          ),
                        )
                      }
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.isFeatured}
                      onChange={(e) =>
                        setMedia(
                          media.map((m) =>
                            m.id === item.id
                              ? { ...m, isFeatured: e.target.checked }
                              : m,
                          ),
                        )
                      }
                    />{" "}
                    Hervorheben
                  </label>
                  <div>
                    <button
                      className="filter"
                      onClick={() => changeMedia(item)}
                    >
                      Speichern
                    </button>{" "}
                    <button
                      className="filter"
                      onClick={() => changeMedia(item, true)}
                    >
                      Löschen
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {activePanel === "reviews" && <AdminReviews />}
        {activePanel === "messages" && (
          <section className="admin-card">
            <div>
              <p className="eyebrow">Posteingang</p>
              <h2>Kontaktanfragen</h2>
              <p className="muted">
                Nachrichten aus dem Kontaktformular, nach Eingangsdatum
                sortiert.
              </p>
            </div>
            <div className="admin-message-filters">
              {[
                ["all", "Alle"],
                ["new", "Neu"],
                ["read", "Gelesen"],
                ["done", "Erledigt"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={
                    messageFilter === value ? "filter active" : "filter"
                  }
                  onClick={() => setMessageFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {visibleMessages.length === 0 ? (
              <p>Keine Anfragen in dieser Ansicht vorhanden.</p>
            ) : (
              visibleMessages.map((item) => (
                <article className="admin-message" key={item.id}>
                  <div className="admin-message-header">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.service || "Allgemeine Anfrage"}</span>
                    </div>
                    <div>
                      <span
                        className={`admin-message-status status-${item.status}`}
                      >
                        {{ new: "Neu", read: "Gelesen", done: "Erledigt" }[
                          item.status
                        ] || item.status}
                      </span>
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleString("de-DE", {
                          timeZone: "Europe/Berlin",
                        })}
                      </time>
                    </div>
                  </div>
                  <p className="admin-message-text">{item.message}</p>
                  <div className="admin-message-contact">
                    <a href={`mailto:${encodeURIComponent(item.email)}`}>
                      {item.email}
                    </a>
                    {item.phone && (
                      <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>
                        {item.phone}
                      </a>
                    )}
                  </div>
                  <div className="admin-message-actions">
                    <label>
                      Status{" "}
                      <select
                        value={item.status}
                        disabled={messageBusy === item.id}
                        onChange={(event) =>
                          void updateSubmission(item.id, event.target.value)
                        }
                      >
                        <option value="new">Neu</option>
                        <option value="read">Gelesen</option>
                        <option value="done">Erledigt</option>
                      </select>
                    </label>
                    <div className="admin-message-actions">
                      <a
                        className="filter"
                        href={`mailto:${encodeURIComponent(item.email)}`}
                      >
                        Antworten ↗
                      </a>
                      <button
                        type="button"
                        className="filter admin-message-delete"
                        disabled={messageBusy === item.id}
                        onClick={() => void deleteSubmission(item.id)}
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}
