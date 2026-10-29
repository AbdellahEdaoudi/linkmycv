"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Loader2,
} from "../components/lucide-react";
import { toast } from "../components/toast";
import { MyContext } from "../context/MyContext";
import {
  DashboardSidebar,
  ProfileSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from "./components";

export default function DashboardPage() {
  const router = useRouter();
  const { data, setData } = useContext(MyContext);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  const [activeTab, setActiveTab] = useState("profile"); // profile, experience, education, skills, languages
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync updated user across state, context, and data_{username} in localStorage
  const syncUserData = (updatedUser) => {
    let mergedUser = updatedUser;
    if (typeof window !== "undefined") {
      try {
        const uName = updatedUser?.username || userData?.username || localStorage.getItem("username");
        if (uName) {
          const raw = localStorage.getItem(`data_${uName}`);
          const currentData = raw ? JSON.parse(raw) : {};
          mergedUser = { ...(currentData.user || {}), ...updatedUser };
          currentData.user = mergedUser;
          localStorage.setItem(`data_${uName}`, JSON.stringify(currentData));
        }
      } catch {
        mergedUser = updatedUser;
      }
      window.dispatchEvent(new Event("auth-change"));
    }
    setUserData(mergedUser);
    setData((prev) => ({ ...prev, user: mergedUser }));
  };

  const updatePartialUser = (key, value) => {
    let mergedUser = null;
    if (typeof window !== "undefined") {
      try {
        const uName = userData?.username || localStorage.getItem("username");
        if (uName) {
          const raw = localStorage.getItem(`data_${uName}`);
          const currentData = raw ? JSON.parse(raw) : {};
          const baseUser = currentData.user || userData || {};
          mergedUser = { ...baseUser, [key]: value };
          currentData.user = mergedUser;
          localStorage.setItem(`data_${uName}`, JSON.stringify(currentData));
        } else {
          mergedUser = { ...(userData || {}), [key]: value };
        }
        window.dispatchEvent(new Event("auth-change"));
      } catch {
        mergedUser = { ...(userData || {}), [key]: value };
      }
    } else {
      mergedUser = { ...(userData || {}), [key]: value };
    }

    setUserData(mergedUser);
    setData((cPrev) => ({ ...cPrev, user: mergedUser }));
    return mergedUser;
  };

  // ── Load user data from context or data_{username} in localStorage ──
  useEffect(() => {
    let currentUser = data?.user;
    if (!currentUser && typeof window !== "undefined") {
      try {
        const uName = localStorage.getItem("username");
        if (uName) {
          const stored = localStorage.getItem(`data_${uName}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            currentUser = parsed.user || parsed;
          }
        }
      } catch {
        currentUser = null;
      }
    }

    if (!currentUser) {
      toast?.error?.("Please log in to access your dashboard.");
      router.push("/auth/login");
      return;
    }

    setUserData(currentUser);
    setLoading(false);
  }, [data, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-slate-50 antialiased pb-16 pt-3 sm:pt-5 animate-pulse">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-3 space-y-3">
              {/* Profile Card Skeleton */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
                <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-2.5 bg-slate-200 rounded-md w-1/2" />
                </div>
              </div>
              {/* Tabs Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 p-1 bg-slate-100/70 lg:bg-transparent rounded-2xl">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-9 bg-white border border-slate-200/60 rounded-xl" />
                ))}
              </div>
            </aside>

            {/* Main Content Workspace Skeleton */}
            <main className="lg:col-span-9 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-7 shadow-xs min-h-[460px] space-y-5">
              {/* Header Skeleton */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-48" />
                  <div className="h-3 bg-slate-100 rounded-md w-64" />
                </div>
                <div className="h-8 bg-slate-200 rounded-xl w-28" />
              </div>

              {/* Avatar Box Skeleton */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded-md w-32" />
                  <div className="h-2.5 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-6 bg-slate-200 rounded-xl w-24 mt-1" />
                </div>
              </div>

              {/* Form Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 bg-slate-100 border border-slate-200/60 rounded-xl" />
                <div className="h-10 bg-slate-100 border border-slate-200/60 rounded-xl" />
                <div className="h-10 bg-slate-100 border border-slate-200/60 rounded-xl" />
                <div className="h-10 bg-slate-100 border border-slate-200/60 rounded-xl" />
              </div>
              <div className="h-24 bg-slate-100 border border-slate-200/60 rounded-xl" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "profile", label: "Profile & Socials", icon: User },
    { id: "experience", label: "Experience", count: userData?.experiences?.length || 0, icon: Briefcase },
    { id: "education", label: "Education", count: userData?.educations?.length || 0, icon: GraduationCap },
    { id: "skills", label: "Skills", count: userData?.skillsList?.length || 0, icon: Sparkles },
    { id: "languages", label: "Languages", count: userData?.languagesList?.length || 0, icon: Languages },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 text-slate-800 antialiased pb-16 pt-3 sm:pt-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        {/* ── Main Grid (Sidebar Tabs + Content) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Navigation Sidebar */}
          <DashboardSidebar
            userData={userData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
          />

          {/* Workspace Content Card */}
          <main className="lg:col-span-9 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs min-h-[460px]">
            {activeTab === "profile" && (
              <ProfileSection
                userData={userData}
                syncUserData={syncUserData}
              />
            )}

            {activeTab === "experience" && (
              <ExperienceSection
                userData={userData}
                updatePartialUser={updatePartialUser}
              />
            )}

            {activeTab === "education" && (
              <EducationSection
                userData={userData}
                updatePartialUser={updatePartialUser}
              />
            )}

            {activeTab === "skills" && (
              <SkillsSection
                userData={userData}
                updatePartialUser={updatePartialUser}
              />
            )}

            {activeTab === "languages" && (
              <LanguagesSection
                userData={userData}
                updatePartialUser={updatePartialUser}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
