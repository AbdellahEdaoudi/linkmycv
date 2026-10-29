"use client";
import React from "react";
import Image from "next/image";

export default function DashboardSidebar({
  userData,
  activeTab,
  setActiveTab,
  navItems,
}) {
  return (
    <aside className="lg:col-span-3 space-y-3">
      {/* Quick Profile Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 shadow-2xs flex items-center gap-2.5 sm:gap-3">
        <div
          onClick={() => setActiveTab("profile")}
          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-purple-50 border-2 border-purple-200 shrink-0 cursor-pointer"
          title="Go to profile"
        >
          <Image
            src={userData?.profileImage || userData?.urlimage || "/avatar.png"}
            alt={userData?.fullname || "User avatar"}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate leading-tight">{userData?.fullname || "My Account"}</p>
          <p className="text-[11px] text-purple-600 font-medium truncate mt-0.5">@{userData?.username || "profile"}</p>
        </div>
      </div>

      {/* Navigation Tabs - Clean, highly intuitive on both Mobile & Desktop */}
      <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 p-1 bg-slate-100/80 lg:bg-transparent rounded-2xl lg:p-0">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                isActive
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/70 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <IconComponent size={15} className={`shrink-0 ${isActive ? "text-white" : "text-purple-600"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {typeof item.count === "number" && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? "bg-purple-800/80 text-white"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
