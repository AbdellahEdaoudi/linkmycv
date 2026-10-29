import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { MyProvider } from "./context/MyContext";
import { ToastProvider } from "./components/toast";
import { Analytics } from "@vercel/analytics/react";

const prompt = Prompt({ subsets: ["latin"], weight: "400" });

export const metadata = {
  metadataBase: new URL("https://linkmycv.site"),
  title: "linkmycv — Your CV in a Single Link",
  description:
    "Create, manage, and share your professional digital CV with a single link and instant QR code. Keep your career up-to-date and impress employers anywhere.",
  keywords: [
    "linkmycv",
    "Resume",
    "Portfolio",
    "CV Link",
    "Bio Link",
    "digital Resume",
    "online presence",
    "personal branding",
    "customizable profiles",
    "QR code generator",
    "portfolio showcase",
  ],
  authors: [{ name: "Abdellah Edaoudi" }],
  creator: "Abdellah Edaoudi",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "linkmycv — Your CV in a Single Link",
    description:
      "Create, manage, and share your professional digital CV with a single link and instant QR code. Keep your career up-to-date and impress employers anywhere.",
    url: "https://linkmycv.site",
    siteName: "linkmycv",
    images: [
      {
        url: "/logo.png",
        width: 408,
        height: 408,
        alt: "linkmycv logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "linkmycv — Your CV in a Single Link",
    description:
      "Create, manage, and share your professional digital CV with a single link and instant QR code. Keep your career up-to-date and impress employers anywhere.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://linkmycv.site",
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
  verification: {
    google: "lrUMetd9EhC65WgbGR59FVNlrRznFFrls_hepjYZacA",
  },
  other: {
    "theme-color": "#ffffff",
    "application-name": "linkmycv",
    "instagram:site": "https://www.instagram.com/linkmycv",
    "image_src": "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LinkMyCV",
    "url": "https://linkmycv.site",
    "description": "Create, manage, and share your professional digital CV with a single link and instant QR code. Keep your career up-to-date and impress employers anywhere.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "image": "https://linkmycv.site/logo.png",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Abdellah Edaoudi"
    }
  };

  return (
    <html className="scroll-smooth" data-scroll-behavior="smooth" lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${prompt.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <MyProvider>
          <ToastProvider>
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
            {children}
          </ToastProvider>
        </MyProvider>
        <Analytics />
      </body>
    </html>
  );
}
