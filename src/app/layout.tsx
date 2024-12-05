import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nav Menu Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-background-tertiary flex min-h-screen flex-col antialiased`}
      >
        <main className="mx-auto w-full max-w-[1440px] flex-grow px-12 py-6">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
