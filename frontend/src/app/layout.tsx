import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Dein Bau Hub e.K. | Innenausbau in Hamburg", template: "%s | Dein Bau Hub" }, description: "Innenausbau, Bausanierung und Modernisierung in Hamburg und Umgebung.", metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="de"><body>{children}</body></html>; }
