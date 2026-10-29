"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { MyContext } from "../../context/MyContext";
import AccountNotFound from "../../components/AccountNotFound";
import LinkMyCV from "../../components/linkmycv";
import { getOrTranslateUserData, SUPPORTED_LANGUAGES } from "../../utils/translation";

export default function TranslatedUserProfilePage({ params }) {
  const unwrappedParams = use(params);
  const username = unwrappedParams?.username;
  const lang = unwrappedParams?.lang?.toLowerCase() || "en";
  const path = usePathname();
  const router = useRouter();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate if language is supported; if not, redirect to base user profile
  useEffect(() => {
    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === lang);
    if (!isSupported && username) {
      router.replace(`/${username}`);
    }
  }, [lang, username, router]);

  useEffect(() => {
    if (!username) return;

    const uName = String(username).toLowerCase().trim();
    const cacheKey = `user_${uName}`;

    // 1. Check local base user and translate immediately if cached
    let cachedBaseUser = null;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          cachedBaseUser = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Error reading cached base user:", err);
      }
    }

    const processTranslation = async (baseUser) => {
      try {
        const translated = await getOrTranslateUserData(baseUser, lang);
        setUserData(translated);
      } catch (err) {
        console.error("Translation processing error:", err);
        setUserData(baseUser);
      } finally {
        setIsLoading(false);
      }
    };

    if (cachedBaseUser) {
      processTranslation(cachedBaseUser);
    }

    // 2. Background check with server to ensure data freshness
    const checkUserUpdates = async () => {
      try {
        const queryParams = cachedBaseUser?.updatedAt
          ? { lastUpdated: cachedBaseUser.updatedAt }
          : {};

        const res = await axios.get(`${SERVER_URL}/api/users/${uName}`, { params: queryParams });

        // If server confirms no updates, our cached translation remains fresh
        if (res.data?.updated === false) {
          return;
        }

        const freshUser = res.data?.user || res.data;
        if (freshUser) {
          if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, JSON.stringify(freshUser));
          }
          await processTranslation(freshUser);
        }
      } catch (error) {
        console.error("Error checking user updates for translation:", error);
        if (!cachedBaseUser) {
          setUserData(null);
          setIsLoading(false);
        }
      }
    };

    checkUserUpdates();
  }, [username, lang, SERVER_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100/80 py-2 sm:py-6 px-2 sm:px-4 flex justify-center text-slate-800 antialiased animate-pulse">
        <div className="w-full max-w-3xl bg-white shadow-md border border-slate-200/90 rounded-xl p-3.5 sm:p-7 text-slate-800 font-sans space-y-5">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-slate-200 border-2 border-purple-200 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <div className="h-5 sm:h-6 bg-slate-200 rounded-md w-44" />
                <div className="h-3.5 bg-purple-100 rounded-md w-56" />
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-200 rounded w-32" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-9 h-9 bg-slate-100 border border-slate-200 rounded-lg shrink-0" />
          </div>

          <div className="space-y-2 mt-3">
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-11/12" />
          </div>

          <div className="space-y-3 mt-4">
            <div className="h-3.5 bg-slate-200 rounded w-36" />
            <div className="border border-slate-200/70 rounded-xl p-3 space-y-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="h-3.5 bg-slate-200 rounded w-40" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData || !userData._id) {
    return <AccountNotFound />;
  }

  return (
    <LinkMyCV
      userData={userData}
      path={path}
      currentLang={lang}
    />
  );
}
