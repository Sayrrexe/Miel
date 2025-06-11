import "./globals.css";

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
    </head>
    <body>{children}</body>
    </html>
  );
}
