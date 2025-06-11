"use client";
import {Header} from "@/components/shared";
import {BrowserRouter} from "react-router-dom";
import {BossPages} from "@/components/shared/dashboardBoss/candidatesPage";
import css from "./main.module.css";

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
    <body>
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