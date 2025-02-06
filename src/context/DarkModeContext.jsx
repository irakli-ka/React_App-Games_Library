import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }
  }, [darkMode, isInitialized]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#232323" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  useEffect(() => {
    if (showEasterEgg) {
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEasterEgg]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      if (prevMode) {
        setShowEasterEgg(true);
      }
      return !prevMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, showEasterEgg }}>
      {children}
    </DarkModeContext.Provider>
  );
};