import React from 'react'
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ||(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen flex flex-col banner">
      <Navbar toggleTheme={toggleTheme} theme={theme}/>
      <main className="flex-1 p-4">{children}</main>
      <Footer />
    </div>
  );
}
