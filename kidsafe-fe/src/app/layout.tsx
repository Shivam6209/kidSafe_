import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KidSafe - Parental Control & Usage Monitor",
  description: "Monitor and control your children's screen time and app usage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
