import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkluBilet",
  description: "Platforma biletowa z wydarzeniami dostosowanymi do potrzeb osób z niepełnosprawnościami słuchowymi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Link href="/" className="inline-block"><img className="m-6" src="/logo.svg" alt="Przejdź na stronę główną"/></Link>
        {children}
      </body>
    </html>
  );
}
