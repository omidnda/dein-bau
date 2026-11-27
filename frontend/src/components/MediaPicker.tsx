"use client";
import { useRef, useState } from "react";
import type { MediaAsset } from "@/content/site";

type Props = {
  label: string;
  value?: string;
  kind: "image" | "video" | "both";
  media: MediaAsset[];
  onChange?: (url: string) => void;
  onUploaded: (asset: MediaAsset) => void;
};
const MAX_SIZE = 200 * 1024 * 1024;
export default function MediaPicker({
  label,
  value = "",
  kind,
  media,
  onChange,
  onUploaded,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const noun = kind === "video" ? "Video" : kind === "image" ? "Bild" : "Datei";
  const accept =
    kind === "image"
      ? "image/jpeg,image/png,image/webp"
      : kind === "video"
        ? "video/mp4,video/webm,video/quicktime"
        : "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime";
  function upload(file: File) {
    setError("");
    if (!accept.split(",").includes(file.type)) {
      setError(
        "Dieses Dateiformat wird nicht unterstützt. Bitte wählen Sie JPG, PNG, WebP, MP4, WebM oder MOV.",
      );
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Die Datei ist zu groß. Erlaubt sind höchstens 200 MB.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media");
    setProgress(0);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable)
        setProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const asset = JSON.parse(xhr.responseText) as MediaAsset;
          onUploaded(asset);
          onChange?.(asset.url);
          setOpen(false);
        } catch {
          setError("Die Antwort konnte nicht verarbeitet werden.");
        }
      } else
        setError(
          xhr.status === 413
            ? "Die Datei ist zu groß. Erlaubt sind höchstens 200 MB."
            : xhr.status === 401
              ? "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
              : "Der Upload ist fehlgeschlagen. Bitte prüfen Sie das Dateiformat und versuchen Sie es erneut.",
        );
    };
    xhr.onerror = () => {
      setProgress(null);
      setError(
        "Der Upload ist fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung.",
      );
    };
    xhr.send(form);
  }
  const isVideo =
    kind === "video" ||
    media.some((item) => item.url === value && item.mediaType === "video");
  return (
    <div className="media-picker">
      <strong>{label}</strong>
      <div
        className="media-drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (progress === null && event.dataTransfer.files[0])
            upload(event.dataTransfer.files[0]);
        }}
      >
        {value ? (
          isVideo ? (
            <video src={value} controls preload="metadata" />
          ) : (
            <img src={value} alt={`Vorschau: ${label}`} />
          )
        ) : (
          <p>
            Hier {kind === "both" ? "Bild oder Video" : noun} ablegen oder
            auswählen
          </p>
        )}
        <input
          ref={input}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) upload(file);
          }}
        />
        <div className="media-actions">
          <button
            type="button"
            className="filter"
            disabled={progress !== null}
            onClick={() => input.current?.click()}
          >
            {value ? `${noun} ersetzen` : `${noun} hochladen`}
          </button>
          {onChange && (
            <button
              type="button"
              className="filter"
              disabled={progress !== null}
              onClick={() => setOpen(!open)}
            >
              Aus Mediathek auswählen
            </button>
          )}
          {value && onChange && (
            <button
              type="button"
              className="filter"
              disabled={progress !== null}
              onClick={() => onChange("")}
            >
              {noun} entfernen
            </button>
          )}
        </div>
        <small>JPG, PNG, WebP, MP4, WebM oder MOV · maximal 200 MB</small>
        {progress !== null && (
          <div role="status">
            Upload: {progress}% <progress value={progress} max={100} />
          </div>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
      {open && (
        <div className="media-library">
          <div className="media-library-head">
            <strong>Aus Mediathek auswählen</strong>
            <button
              type="button"
              className="filter"
              onClick={() => setOpen(false)}
            >
              Schließen
            </button>
          </div>
          <div className="media-library-grid">
            {media
              .filter((item) => kind === "both" || item.mediaType === kind)
              .map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="media-choice"
                  onClick={() => {
                    onChange?.(item.url);
                    setOpen(false);
                  }}
                >
                  {item.mediaType === "video" ? (
                    <video src={item.url} preload="metadata" />
                  ) : (
                    <img src={item.url} alt="" />
                  )}
                  <span>{item.title || item.name}</span>
                </button>
              ))}
          </div>
          {!media.some(
            (item) => kind === "both" || item.mediaType === kind,
          ) && (
            <p>In der Mediathek sind noch keine passenden Dateien vorhanden.</p>
          )}
        </div>
      )}
    </div>
  );
}
