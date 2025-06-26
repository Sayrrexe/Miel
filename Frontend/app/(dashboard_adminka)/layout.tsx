"use client";
import {BrowserRouter} from "react-router-dom";
import {Header} from "@/components/shared";
import {
  AdminPages
} from "@/components/shared/dashboardAdmin/administrationPage";
import React, {useEffect} from "react";
import css from "./main.module.css";

export default function RootLayout({children}: Readonly<{
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

    <BrowserRouter>
      <Header />
      <main className={`flex ${css.main}`}>
        <AdminPages />
        {localStorage.getItem("token") ? (
          children
        ) : (
          <p>Вы не авторизованы</p>
        )}
      </main>
    </BrowserRouter>
  );
}