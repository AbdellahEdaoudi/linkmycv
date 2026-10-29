"use client";
import { createContext, useEffect, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        let loadedData = null;
        try {
          const username = localStorage.getItem("username");
          if (username) {
            const stored = localStorage.getItem(`data_${username}`);
            if (stored) loadedData = JSON.parse(stored);
          }
        } catch (e) {
          console.error("Failed to parse data from localStorage", e);
        }

        if (loadedData) {
          setData(loadedData);
        } else {
          setData({});
        }
      }
    };

    loadUser();

    window.addEventListener("auth-change", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        data,
        setData,
        CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
        SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
