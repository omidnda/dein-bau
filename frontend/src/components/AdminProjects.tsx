"use client";
import { useEffect, useState } from "react";
import MediaPicker from "@/components/MediaPicker";
import type { MediaAsset } from "@/content/site";

type Entry = { id: number; posterId: number | null };
type Project = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  published: boolean;
  sortOrder: number;
  coverId: number | null;
  media: Entry[];
};
const empty = (): Project => ({
  title: "",
  slug: "",
  description: "",
  location: "",
  category: "",
  published: false,
  sortOrder: 0,
  coverId: null,
  media: [],
});
export default function AdminProjects({
  media,
  onUploaded,
}: {
  media: MediaAsset[];
  onUploaded: (asset: MediaAsset) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState<Project | null>(null);
  const [status, setStatus] = useState("Projekte werden geladen …");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const response = await fetch("/api/admin/projects", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      setProjects((await response.json()).results);
      setStatus("");
    } catch {
      setStatus(
        "Projekte konnten nicht geladen werden. Bitte Verbindung prüfen und erneut versuchen.",
      );
    }
  }
  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);
  function update(patch: Partial<Project>) {
    setCurrent((item) => (item ? { ...item, ...patch } : item));
  }
  function assetId(url: string) {
    const asset = media.find((item) => item.url === url);
    return asset ? Number(asset.id) : null;
  }
  async function save() {
    if (!current || busy) return;
    if (!current.title.trim()) {
      setStatus("Bitte geben Sie einen Projekttitel ein.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: current.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Speichern fehlgeschlagen.");
      setCurrent(data);
      await load();
      setStatus("Projekt gespeichert.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Speichern fehlgeschlagen.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !current?.id ||
      !window.confirm(
        "Projekt wirklich entfernen? Die Mediendateien bleiben erhalten.",
      )
    )
      return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id }),
      });
      if (!response.ok) throw new Error();
      setCurrent(null);
      await load();
      setStatus("Projekt entfernt.");
    } catch {
      setStatus("Projekt konnte nicht entfernt werden.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-card admin-reference-editor">
      <p className="eyebrow">Referenzen</p>
      <h2>Projekte verwalten</h2>
      <p>
        Erstellen und bearbeiten Sie Projekte für die Referenzseite. Dateien
        bleiben in der Mediathek erhalten.
      </p>
      <p role="status">{status}</p>
      <button
        type="button"
        className="filter"
        onClick={() => setCurrent(empty())}
      >
        Neues Projekt
      </button>
      {projects.map((project) => (
        <button
          type="button"
          className="filter"
          key={project.id}
          onClick={() => setCurrent(project)}
        >
          {project.title} {project.published ? "· Veröffentlicht" : "· Entwurf"}
        </button>
      ))}
      {current && (
        <div className="admin-reference-section">
          <h3>{current.id ? "Projekt bearbeiten" : "Neues Projekt"}</h3>
          {(
            [
              ["title", "Titel"],
              ["slug", "URL-Kennung (optional)"],
              ["location", "Ort"],
              ["category", "Kategorie"],
            ] as const
          ).map(([key, label]) => (
            <label className="admin-field" key={key}>
              {label}
              <input
                value={current[key]}
                onChange={(event) => update({ [key]: event.target.value })}
              />
            </label>
          ))}
          <label className="admin-field">
            Beschreibung
            <textarea
              rows={5}
              value={current.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </label>
          <label className="admin-field">
            Reihenfolge
            <input
              type="number"
              min="0"
              value={current.sortOrder}
              onChange={(event) =>
                update({ sortOrder: Number(event.target.value) })
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={current.published}
              onChange={(event) => update({ published: event.target.checked })}
            />{" "}
            Projekt veröffentlichen
          </label>
          <MediaPicker
            label="Titelbild"
            kind="image"
            media={media}
            value={
              media.find((item) => Number(item.id) === current.coverId)?.url ??
              ""
            }
            onUploaded={(asset) => {
              onUploaded(asset);
              update({ coverId: Number(asset.id) });
            }}
            onChange={(url) => {
              const id = assetId(url);
              if (id || !url) update({ coverId: id });
            }}
          />
          <MediaPicker
            label="Bild oder Video hinzufügen"
            kind="both"
            media={media}
            onUploaded={(asset) => {
              onUploaded(asset);
              setCurrent((item) =>
                item &&
                !item.media.some((entry) => entry.id === Number(asset.id))
                  ? {
                      ...item,
                      media: [
                        ...item.media,
                        { id: Number(asset.id), posterId: null },
                      ],
                    }
                  : item,
              );
            }}
            onChange={(url) => {
              const id = assetId(url);
              if (id && !current.media.some((entry) => entry.id === id))
                update({ media: [...current.media, { id, posterId: null }] });
            }}
          />
          <h4>Aufnahmen und Reihenfolge</h4>
          {current.media.map((entry, index) => {
            const asset = media.find((item) => Number(item.id) === entry.id);
            return (
              <div className="admin-project-media-item" key={entry.id}>
                <span>
                  {asset?.title || asset?.name || `Datei ${entry.id}`}
                </span>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...current.media];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    update({ media: next });
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === current.media.length - 1}
                  onClick={() => {
                    const next = [...current.media];
                    [next[index + 1], next[index]] = [
                      next[index],
                      next[index + 1],
                    ];
                    update({ media: next });
                  }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      media: current.media.filter(
                        (item) => item.id !== entry.id,
                      ),
                    })
                  }
                >
                  Entfernen
                </button>
                {asset?.mediaType === "video" && (
                  <MediaPicker
                    label="Videovorschaubild"
                    kind="image"
                    media={media}
                    value={
                      media.find((item) => Number(item.id) === entry.posterId)
                        ?.url ?? ""
                    }
                    onUploaded={(asset) => {
                      onUploaded(asset);
                      update({
                        media: current.media.map((item) =>
                          item.id === entry.id
                            ? { ...item, posterId: Number(asset.id) }
                            : item,
                        ),
                      });
                    }}
                    onChange={(url) => {
                      const id = assetId(url);
                      if (id || !url)
                        update({
                          media: current.media.map((item) =>
                            item.id === entry.id
                              ? { ...item, posterId: id }
                              : item,
                          ),
                        });
                    }}
                  />
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="button button-primary"
            disabled={busy}
            onClick={save}
          >
            Projekt speichern
          </button>
          {current.id && (
            <button
              type="button"
              className="filter"
              disabled={busy}
              onClick={remove}
            >
              Projekt entfernen
            </button>
          )}
        </div>
      )}
    </section>
  );
}
