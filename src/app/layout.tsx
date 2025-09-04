import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import Image from "next/image";

const heading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const body = Poppins({ subsets: ["latin"], weight: ["300","400","500","600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Clarity + Consistency — Axelus × Boratu",
  description: "Free 75-minute workshop for founders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">
        <header className="bg-white border-b">
          <div className="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
            <div className="flex items-center gap-3">
              <Image src="/logo-axelus.png" alt="Axelus" width={120} height={32} className="w-auto h-8" priority />
              <span className="w-px h-6 bg-gray-200" />
              <Image src="/partner-logo.png" alt="Axelus" width={120} height={32} className="w-auto h-8" priority />
            </div>
            <nav className="text-sm">
              <a className="hover:opacity-70" href="/event">Event</a>
            </nav>
          </div>
          {/* thin yellow stripe nodding to partner */}
          <div className="h-1 w-full bg-[color:var(--brand-secondary)]" />
        </header>
        <main className="max-w-3xl px-4 py-10 mx-auto">{children}</main>
        <footer className="mt-16 border-t">
          <div className="max-w-5xl px-4 py-6 mx-auto text-xs text-gray-500">
            © {new Date().getFullYear()} Axelus × Boratu Digital
          </div>
        </footer>
      </body>
    </html>
  );
}
