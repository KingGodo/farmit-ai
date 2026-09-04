import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#163528",
};

export const metadata: Metadata = {
  title: `${site.name} — Crop advice on WhatsApp`,
  description: site.description,
  icons: {
    icon: [
      { url: "/icon.png?v=4", type: "image/png", sizes: "64x64" },
    ],
    apple: [{ url: "/apple-icon.png?v=4", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
