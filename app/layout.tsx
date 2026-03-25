import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GearHouse Africa — Premium Tech Shop",
  description:
    "GearHouse Africa is your destination for premium tech gear — laptops, peripherals, gadgets and more. Powered by Corban Technologies LTD.",
  keywords: ["tech shop", "gadgets", "peripherals", "electronics", "GearHouse", "Corban Technologies"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GearHouse",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "GearHouse — Premium Tech Shop",
    description: "Shop premium tech gear at GearHouse. Powered by Corban Technologies LTD.",
    type: "website",
    locale: "en_US",
    siteName: "GearHouse",
  },
  twitter: {
    card: "summary",
    title: "GearHouse — Premium Tech Shop",
    description: "Shop premium tech gear at GearHouse.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0071E3",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GearHouse" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#1D1D1F",
              color: "#FFFFFF",
              fontSize: "14px",
            },
          }}
        />

        <NextAuthProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
