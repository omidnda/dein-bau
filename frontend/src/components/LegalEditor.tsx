"use client";
import { useEffect, useRef, useState } from "react";
import LegalMarkdown from "@/components/LegalMarkdown";
import { markdownToSections, sectionsToMarkdown, type LegalSection } from "@/lib/legal-markdown";

type Document = { title: string; sections: LegalSection[]; vatId?: string; registerCourt?: string; registerNumber?: string };
export default function LegalEditor({ document, kind, onSave, onDirty }: { document: Document; kind: "impressum" | "datenschutz"; onSave: (document: Document) => Promise<boolean>; onDirty: (dirty: boolean) => void }) {
  const [draft, setDraft] = useState(document);
  const [markdown, setMarkdown] = useState(() => sectionsToMarkdown(document.sections));
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const initialMarkdown = sectionsToMarkdown(document.sections);
  const dirty = markdown !== initialMarkdown || JSON.stringify(draft) !== JSON.stringify(document);
  useEffect(() => { onDirty(dirty); return () => onDirty(false); }, [dirty, onDirty]);
  function format(before: string, after = "") {
    const element = textarea.current; if (!element) return;
    const start = element.selectionStart, end = element.selectionEnd;
    const selected = markdown.slice(start, end) || "Text";
    setMarkdown(markdown.slice(0, start) + before + selected + after + markdown.slice(end));
    requestAnimationFrame(() => { element.focus(); element.setSelectionRange(start + before.length, start + before.length + selected.length); });
  }
  async function save() {
    setSaving(true); setMessage("");
    const next = { ...draft, sections: markdown === initialMarkdown ? document.sections : markdownToSections(markdown) };
    const ok = await onSave(next);
    setMessage(ok ? "Das Dokument wurde gespeichert." : "Das Dokument konnte nicht gespeichert werden."); setSaving(false);
  }
  function discard() { setDraft(document); setMarkdown(initialMarkdown); setMessage("Änderungen wurden verworfen."); }
  return <section className="admin-card legal-editor"><div><p className="eyebrow">Rechtliches</p><h2>{kind === "impressum" ? "Impressum" : "Datenschutzerklärung"}</h2><p className="muted">Fügen Sie den gesamten Text ein. Überschriften mit zwei Rauten (##) beginnen einen neuen Abschnitt.</p></div>
    <label className="admin-field">Seitentitel<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
    {kind === "impressum" && <div className="legal-register">{([ ["vatId", "USt-IdNr."], ["registerCourt", "Registergericht"], ["registerNumber", "Registernummer"] ] as const).map(([key, label]) => <label className="admin-field" key={key}>{label}<input value={draft[key] ?? ""} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}</div>}
    <div className="legal-editor-tabs"><button type="button" className="filter" aria-pressed={!preview} onClick={() => setPreview(false)}>Bearbeiten</button><button type="button" className="filter" aria-pressed={preview} onClick={() => setPreview(true)}>Vorschau</button></div>
    {preview ? <div className="legal-preview"><LegalMarkdown text={markdown} /></div> : <><div className="legal-toolbar" aria-label="Text formatieren"><button type="button" className="filter" onClick={() => format("## ")}>Überschrift</button><button type="button" className="filter" onClick={() => format("**", "**")}>Fett</button><button type="button" className="filter" onClick={() => format("*", "*")}>Kursiv</button><button type="button" className="filter" onClick={() => format("- ")}>Liste</button><button type="button" className="filter" onClick={() => format("[", "](https://)")}>Link</button></div><label className="admin-field">Dokument<textarea ref={textarea} className="legal-editor-input" value={markdown} onChange={(event) => setMarkdown(event.target.value)} /></label></>}
    <div className="media-actions"><button type="button" className="button button-primary" disabled={saving || !dirty} onClick={() => void save()}>Speichern</button><button type="button" className="filter" disabled={saving || !dirty} onClick={discard}>Änderungen verwerfen</button></div><p role="status">{message}</p>
  </section>;
}
