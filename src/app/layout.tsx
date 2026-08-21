import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export const metadata: Metadata = {
  title: "Control Financiero | Gestión Personal",
  description: "Plataforma moderna, sobria y accesible para el control de tus finanzas personales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
