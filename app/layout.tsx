import type { Metadata } from "next";
import "./globals.css";
import {Poppins} from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200','300','400','500','600','700','800', '900'],
  variable: '--font-poppins',

})

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
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
