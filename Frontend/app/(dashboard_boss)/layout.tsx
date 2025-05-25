"use client";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared";
import { BrowserRouter } from "react-router-dom";
import { BossPages } from "@/components/shared/dashboardBoss/candidatesPage";
import css from "./main.module.css";

const PTSans = PT_Sans({
  subsets: ["cyrillic"],
  variable: "--font-PT_Sans",
  weight: ["400", "700"],
});
//{data.username != "" ? (
//children
//) : (
//<p className="text-4xl m-[50px]">Вы неавторизованны</p>
//)}
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
      <body className={`${PTSans.variable}`}>
        <BrowserRouter>
          <Header />
          <main className={`flex ${css.main}`}>
            <BossPages />
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
