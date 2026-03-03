import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AIOpdf (All In One PDF) | Advanced PDF Tools",
  description:
    "Professional PDF tools that run entirely in your browser. Edit, merge, split, compress, and transform your PDFs instantly.",
  keywords: [
    "pdf",
    "pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "AIOpdf",
    "all in one pdf",
  ],
  openGraph: {
    title: "AIOpdf (All In One PDF)",
    description:
      "Professional PDF tools that run entirely in your browser. Edit, merge, split, compress, and transform your PDFs instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIOpdf (All In One PDF)",
    description:
      "Professional PDF tools that run entirely in your browser. Edit, merge, split, compress, and transform your PDFs instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
