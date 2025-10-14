"use client";
import {Header} from "@/components/shared";
import {
  AdminPages
} from "@/components/shared/dashboardAdmin/administrationPage";
import React, {useEffect, useState} from "react";
import css from "./main.module.css";

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      // Log localStorage contents for debugging
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = key && localStorage.getItem(key);
        console.log(`${key}: ${value}`);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className={`flex ${css.main}`}>
        <AdminPages />
        {isAuthenticated ? (
          children
        ) : (
          <p>Вы не авторизованы</p>
        )}
      </main>
    </>
  );
}