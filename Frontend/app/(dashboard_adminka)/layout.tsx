"use client";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { BrowserRouter } from "react-router-dom";
import { Header } from "@/components/shared";
import { AdminPages } from "@/components/shared/dashboardAdmin/administrationPage";
import { useEffect } from "react";

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
  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = key && localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <link data-rh="true" rel="icon" href="/logo.png" />
      </head>
      <body className={`${PTSans.variable}`}>
        <Header />
        <BrowserRouter>
          <main className="flex ">
            <AdminPages />
            {localStorage.getItem("token") ? (
              children
            ) : (
              <p>Вы не авторизованы</p>
            )}
          </main>
        </BrowserRouter>
      </body>
    </html>
  );
}
