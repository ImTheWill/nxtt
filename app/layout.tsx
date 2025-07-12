import type { Metadata } from "next";
import "./globals.css";

//import { Geist, Geist_Mono } from "next/font/google";
/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); -- className={`${geistSans.variable} ${geistMono.variable} antialiased`} */

export const metadata: Metadata = {
  title: "Moxie's Drive",
  description: "Please Hire me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
