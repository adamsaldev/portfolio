import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { personal, seo } from "@/data/portfolio";
import { ClientEffects } from "@/components/ClientEffects";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InlineScript } from "@/components/InlineScript";
import { paletteItems } from "@/lib/palette";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // Canonical + absolute Open Graph URLs. Falls back to localhost for local builds.
  metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
  title: { default: seo.title, template: `%s — ${personal.name}` },
  description: seo.description,
  authors: [{ name: personal.name }],
  creator: personal.name,
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: personal.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      id="top"
      // Keeps CSS smooth scrolling for in-page anchors, but makes route
      // changes jump to the top instantly — otherwise the scroll runs during
      // the card → hero morph and the image lands, then snaps.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: apply saved theme, mark JS as available (enables reveal animations). */}
        <InlineScript html={`(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}})()`} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <ClientEffects />
        <CommandPalette items={paletteItems()} />
      </body>
    </html>
  );
}
