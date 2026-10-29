"use client";
import React, { useState } from "react";
import axios from "axios";
import { Languages, Plus, Loader2, X } from "../../components/lucide-react";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function LanguagesSection({ userData, updatePartialUser }) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [newLanguageName, setNewLanguageName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const languagesList = userData?.languagesList || [];

  const handleAddLanguage = async (e) => {
    e.preventDefault();
    if (!newLanguageName.trim()) return;
    setIsAdding(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/users/languages`,
        { language: newLanguageName.trim() },
        { withCredentials: true }
      );
      updatePartialUser("languagesList", res.data.languagesList);
      setNewLanguageName("");
      toast?.success?.("Language added");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to add language." });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLanguage = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${SERVER_URL}/api/users/languages/${id}`, {
        withCredentials: true,
      });
      updatePartialUser("languagesList", res.data.languagesList);
      toast?.success?.("Language removed");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to remove language." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="border-b border-slate-100 pb-3 mb-3.5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Languages size={16} className="text-teal-600 shrink-0" />
          <span>Spoken Languages ({languagesList.length})</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Add languages you speak.
        </p>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAddLanguage} className="flex gap-2 mb-4">
        <input
          type="text"
          maxLength={100}
          value={newLanguageName}
          onChange={(e) => setNewLanguageName(e.target.value)}
          placeholder="e.g. Arabic (Native), English..."
          className="flex-1 min-w-0 bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={isAdding || !newLanguageName.trim()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition duration-200 disabled:opacity-50 shrink-0"
        >
          {isAdding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          <span>Add</span>
        </button>
      </form>

      {/* Languages List */}
      {languagesList.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No languages added yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {languagesList.map((lang) => {
            const isDeletingThis = deletingId === lang._id;
            return (
              <span
                key={lang._id}
                className={`group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-semibold transition duration-150 ${
                  isDeletingThis
                    ? "border-rose-300 bg-rose-50/50 text-slate-400 opacity-70"
                    : "border-slate-200 hover:border-teal-300 text-slate-800"
                }`}
              >
                <span>{lang.language}</span>
                <button
                  type="button"
                  disabled={isDeletingThis}
                  onClick={() => handleDeleteLanguage(lang._id)}
                  title="Remove language"
                  className="text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
                >
                  {isDeletingThis ? (
                    <Loader2 size={13} className="animate-spin text-rose-500" />
                  ) : (
                    <X size={13} />
                  )}
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
