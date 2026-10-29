"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  LayoutDashboard,
  ExternalLink,
} from "./lucide-react";
import { MyContext } from "../context/MyContext";

function Navbar() {
  const router = useRouter();
  const { data, setData } = useContext(MyContext);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [setting, setSetting] = useState(true);
  const navRef = useRef(null);

  // Read user from context or localStorage
  const readUser = () => {
    if (typeof window === "undefined") return null;
    try {
      const username = localStorage.getItem("username");
      if (username) {
        const stored = localStorage.getItem(`data_${username}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.user || parsed;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  useEffect(() => {
    setMounted(true);

    const currentUser = data?.user || readUser();
    setUser(currentUser);
    if (currentUser && !data?.user) {
      setData((prev) => ({ ...prev, user: currentUser }));
    }

    const handleAuthSync = () => {
      const u = readUser();
      setUser(u);
    };

    window.addEventListener("auth-change", handleAuthSync);
    window.addEventListener("storage", handleAuthSync);

    return () => {
      window.removeEventListener("auth-change", handleAuthSync);
      window.removeEventListener("storage", handleAuthSync);
    };
  }, []);

  // Keep in sync with context
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else if (mounted) {
      const u = readUser();
      setUser(u);
    }
  }, [data?.user, mounted]);

  // Click outside to close settings menu
  useEffect(() => {
    const clickOutside = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setSetting(true);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const Logout = async () => {
    setSetting(true);
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth-change"));
    }
    setData({});
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <div ref={navRef} className="sticky top-0 z-40">
      <nav className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
          <div className="flex justify-between items-center">
            {/* LOGO */}
            <div
              onClick={() => {
                router.push("/");
                setSetting(true);
              }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
            >
              <Image
                src="/mycvlink-logo.png"
                alt="linkmycv Logo"
                width={36}
                height={36}
                priority
                className="w-[30px] h-[30px] sm:w-[38px] sm:h-[38px] object-contain"
              />
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                link<span className="text-purple-600">mycv</span>
              </span>
            </div>

            {/* USER PROFILE & ACTIONS */}
            <div>
              {!mounted ? (
                /* ── Navbar Actions Skeleton (Exact same height and width as authenticated state) ── */
                <div className="flex items-center gap-1.5 sm:gap-3 animate-pulse">
                  {/* Dashboard link skeleton */}
                  <div className="h-[34px] w-[34px] sm:w-[110px] bg-slate-100 border border-slate-200/60 rounded-xl" />
                  {/* User pill skeleton */}
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-transparent">
                    <div className="w-[34px] h-[34px] rounded-full bg-slate-200 border-2 border-purple-200 shrink-0" />
                    <div className="hidden sm:flex flex-col gap-1 w-20">
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>
                  {/* Settings button skeleton */}
                  <div className="w-[34px] h-[34px] rounded-xl bg-slate-100 border border-slate-200/80 shrink-0" />
                </div>
              ) : user ? (
                /* ── Logged In User State ── */
                <div className="flex items-center gap-1.5 sm:gap-3">
                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition duration-200 shadow-2xs"
                  >
                    <LayoutDashboard size={15} />
                    <span className="hidden xs:inline sm:inline">Dashboard</span>
                  </Link>

                  {/* View Live CV */}
                  {user.username && (
                    <Link
                      href={`/${user.username}`}
                      className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-slate-100 border border-slate-200/80 transition duration-200"
                    >
                      <span>Live CV</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </Link>
                  )}

                  {/* Contact Us (Available for logged-in users) */}
                  <Link
                    href="/contact"
                    className="hidden lg:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-slate-100 border border-slate-200/80 transition duration-200"
                  >
                    <MessageSquare size={15} className="text-slate-500" />
                    <span>Contact</span>
                  </Link>

                  {/* Admin Panel Link (if role === admin) */}
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition duration-200"
                    >
                      <Shield size={14} className="text-amber-600" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* User Profile Pill */}
                  <div
                    onClick={() => setSetting(!setting)}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 cursor-pointer transition duration-200 border border-transparent hover:border-slate-200"
                  >
                    <Image
                      className="w-[34px] h-[34px] min-w-[34px] aspect-square object-cover rounded-full border-2 border-purple-400"
                      src={user.profileImage || user.urlimage || "/avatar.png"}
                      width={34}
                      height={34}
                      alt={user.fullname || "Profile"}
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate max-w-[140px] leading-tight">
                        {user.fullname}
                      </span>
                      {user.role === "admin" && (
                        <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider leading-none mt-0.5">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Settings Trigger Icon */}
                  <button
                    onClick={() => setSetting(!setting)}
                    title="Menu"
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition duration-200"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              ) : (
                /* ── Guest State (Not Logged In) ── */
                /* Notice: No Contact link here because Registration is mandatory for Contact */
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="text-slate-700 hover:text-purple-600 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl hover:bg-slate-100 transition duration-150"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2 rounded-xl transition shadow-xs hover:shadow-md duration-150"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </nav>

      {/* ── SETTINGS DROPDOWN MENU ── */}
      {!setting && user && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 sm:right-8 top-16 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2.5 z-50 text-xs sm:text-sm text-slate-700 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Preview */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 mb-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900 truncate">{user.fullname}</p>
              {user.role === "admin" && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wide">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">@{user.username}</p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setSetting(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition font-medium"
          >
            <LayoutDashboard size={16} className="text-purple-600" />
            <span>Dashboard</span>
          </Link>

          {user.username && (
            <Link
              href={`/${user.username}`}
              onClick={() => setSetting(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition font-medium"
            >
              <ExternalLink size={16} className="text-slate-400" />
              <span>View Live CV</span>
            </Link>
          )}

          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setSetting(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition font-medium"
            >
              <Shield size={16} className="text-amber-500" />
              <span>Admin Panel</span>
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setSetting(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition font-medium"
          >
            <MessageSquare size={16} className="text-slate-400" />
            <span>Contact Us</span>
          </Link>

          <div className="border-t border-slate-100 my-1.5 pt-1.5">
            <button
              onClick={Logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition font-medium text-left"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
