"use client";
import {Header} from "@/components/shared";
import {BrowserRouter} from "react-router-dom";
import {BossPages} from "@/components/shared/dashboardBoss/candidatesPage";
import css from "./main.module.css";
import React from "react";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (

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
  );
}