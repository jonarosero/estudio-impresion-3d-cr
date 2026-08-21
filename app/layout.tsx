import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { FirebaseAuthProvider } from "@/components/firebase/auth-provider";
import { FirebaseCatalogProvider } from "@/components/firebase/catalog-provider";
import { OnboardingGate } from "@/components/account/onboarding-gate";
import { SiteChrome } from "@/components/ui/site-chrome";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Estudio de Impresión 3D J&J",
    template: "%s | J&J",
  },
  description: "Objetos impresos en 3D, creados con calma para espacios con personalidad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>
        <FirebaseAuthProvider><FirebaseCatalogProvider><OnboardingGate><SiteChrome>{children}</SiteChrome></OnboardingGate></FirebaseCatalogProvider></FirebaseAuthProvider>
      </body>
    </html>
  );
}
