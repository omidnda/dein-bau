"use client";
import { FormEvent, useState } from "react";

export default function ContactForm({
  services,
}: {
  services: { title: string }[];
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Name
          <input required name="name" autoComplete="name" />
        </label>
        <label>
          E-Mail
          <input required type="email" name="email" autoComplete="email" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Telefon
          <input name="phone" autoComplete="tel" />
        </label>
        <label>
          Leistungsart
          <select name="service" defaultValue="">
            <option value="" disabled>
              Bitte auswählen
            </option>
            {services.map((service) => (
              <option key={service.title}>{service.title}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Projektbeschreibung
        <textarea
          required
          name="message"
          rows={6}
          placeholder="Was möchten Sie verändern?"
        />
      </label>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
      <button className="button button-primary" disabled={state === "sending"}>
        {state === "sending" ? "Wird gesendet …" : "Anfrage senden"}
      </button>
      {state === "sent" && (
        <p className="form-success">Danke – Ihre Anfrage wurde übermittelt.</p>
      )}
      {state === "error" && (
        <p className="form-error">
          Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es
          später erneut.
        </p>
      )}
    </form>
  );
}
