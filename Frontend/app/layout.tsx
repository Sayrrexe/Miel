import { PT_Sans } from "next/font/google";
import "./globals.css";

const PTSans = PT_Sans({
  subsets: ["cyrillic"],
  variable: "--font-PT_Sans",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link data-rh="true" rel="icon" href="/logo.png" />
      </head>
      <body className={`${PTSans.variable}`}>{children}</body>
    </html>
  );
}
