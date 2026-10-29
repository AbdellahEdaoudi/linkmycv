"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { Loader2 } from "../components/lucide-react";
import { MyContext } from "../context/MyContext";
import AccountNotFound from "../components/AccountNotFound";
import LinkMyCV from "../components/linkmycv";

export default function UserProfilePage({ params }) {
  const unwrappedParams = use(params);
  const username = unwrappedParams?.username;
  const path = usePathname();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const uName = String(username).toLowerCase().trim();
    const cacheKey = `user_${uName}`;

    // 1. Read cached user from localStorage and render immediately
    let cachedUser = null;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          cachedUser = JSON.parse(stored);
          setUserData(cachedUser);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error reading cached user:", err);
      }
    }

    // 2. Perform lightweight background check with server using lastUpdated
    const checkUserUpdates = async () => {
      try {
        const params = cachedUser?.updatedAt ? { lastUpdated: cachedUser.updatedAt } : {};

        const res = await axios.get(`${SERVER_URL}/api/users/${uName}`, { params });

        // If server confirms no updates, continue using cached local data
        if (res.data?.updated === false) {
          return;
        }

        // On updates or initial load: sync state and update localStorage
        const freshUser = res.data?.user || res.data;
        if (freshUser) {
          setUserData(freshUser);
          if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, JSON.stringify(freshUser));
          }
        }
      } catch (error) {
        console.error("Error validating user profile:", error);
        if (!cachedUser) {
          setUserData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserUpdates();
  }, [username, SERVER_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100/80 py-2 sm:py-6 px-2 sm:px-4 flex justify-center text-slate-800 antialiased animate-pulse">
        {/* Exact same PDF Sheet Document Container as linkmycv.jsx */}
        <div className="w-full max-w-3xl bg-white shadow-md border border-slate-200/90 rounded-xl p-3.5 sm:p-7 text-slate-800 font-sans space-y-5">
          {/* Header Skeleton matching compact executive header */}
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

          {/* Summary Skeleton */}
          <div className="space-y-2 mt-3">
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-11/12" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
          </div>

          {/* Work Experience Skeleton */}
          <div className="space-y-3 mt-4">
            <div className="h-3.5 bg-slate-200 rounded w-36" />
            <div className="border border-slate-200/70 rounded-xl p-3 space-y-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="h-3.5 bg-slate-200 rounded w-40" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-28" />
              <div className="h-2.5 bg-slate-100 rounded w-full mt-1.5" />
            </div>
            <div className="border border-slate-200/70 rounded-xl p-3 space-y-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="h-3.5 bg-slate-200 rounded w-36" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-24" />
            </div>
          </div>

          {/* Education Skeleton */}
          <div className="space-y-3 mt-4">
            <div className="h-3.5 bg-slate-200 rounded w-36" />
            <div className="border border-slate-200/70 rounded-xl p-3 space-y-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div className="h-3.5 bg-slate-200 rounded w-44" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-32" />
            </div>
          </div>

          {/* Skills Badges Skeleton */}
          <div className="space-y-2 mt-4">
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-6 w-20 bg-slate-100 border border-slate-200/60 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData || !userData._id) {
    return <AccountNotFound />;
  }

  return <LinkMyCV userData={userData} path={path} currentLang="en" />;
}