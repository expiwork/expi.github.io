import type { Metadata } from "next";
import "@/app/globals.css";
import { Vazirmatn } from "next/font/google";
import { defaultMetadata } from "./metadata";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });

export const metadata: Metadata = {
  metadataBase: new URL("https://expi.work"),
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
  verification: {
    google: "nRfpLnUsSS0RMH_8MBwVqZ4BQgnyu6N78V9Ny2TkCik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5", // Replace with your brand color
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    siteName: "اکسپی",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadata.title,
    description: defaultMetadata.description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className={vazirmatn.className + " h-full"}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQDDH462"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GoogleAnalytics gaId="G-2Z2T81KZ7Y" />
        <GoogleTagManager gtmId="GTM-MQDDH462" />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}