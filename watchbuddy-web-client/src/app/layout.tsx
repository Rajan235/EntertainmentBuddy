import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WatchBuddy",
  description: "Track your favorite shows and movies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en" className="dark" suppressHydrationWarning>
    /* The font is now applied globally via the globals.css file,
        so we don't need to add a specific class to the body tag here.
      */
    // <body className="bg-red text-foreground">{children}</body>
    <html lang="en" className="dark" suppressHydrationWarning>
      <head></head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
