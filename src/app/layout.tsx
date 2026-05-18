import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amigo Invisible Futbol",
  description: "Sorteo profesional de camisetas de futbol",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
