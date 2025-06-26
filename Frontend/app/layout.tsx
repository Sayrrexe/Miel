import "./globals.css";
import React from "react";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link
        data-rh="true"
        rel="icon"
        href="/logo.png"
      />
      <title>
        "Миэль"
      </title>
    </head>
    <body>{children}</body>
    </html>
  );
}
