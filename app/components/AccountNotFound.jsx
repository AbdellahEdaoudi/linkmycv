"use client";

import React from "react";
import Link from "next/link";
import { UserRoundSearch, ArrowRight, ArrowLeft, LifeBuoy, Sparkles } from "./lucide-react";

export default function AccountNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-purple-50/60 via-slate-50 to-white">
      <div className="max-w-md w-full text-center bg-white border border-slate-200/90 shadow-xl rounded-2xl p-6 sm:p-8 backdrop-blur-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Icon Badge */}
        <div className="mb-5 relative inline-block">
          <div className="w-20 h-20 mx-auto bg-purple-50 border-2 border-purple-200 rounded-2xl flex items-center justify-center text-purple-600 shadow-xs">
            <UserRoundSearch size={38} strokeWidth={1.8} />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-600 text-white shadow-xs">
            404
          </span>
        </div>

        {/* Headings */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Profile Not Found
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
          The link you visited does not belong to an active LinkMyCV profile. It may have been renamed, removed, or has not been claimed yet.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href="/auth/register"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm shadow-sm"
          >
            <span>Claim Your Own CV Link</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm"
          >
            <ArrowLeft size={14} />
            <span>Return to Homepage</span>
          </Link>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition"
            >
              <LifeBuoy size={13} />
              <span>Need help? Contact LinkMyCV Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
