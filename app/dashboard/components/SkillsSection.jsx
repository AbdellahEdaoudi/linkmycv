"use client";
import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Plus, Loader2, X } from "../../components/lucide-react";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function SkillsSection({ userData, updatePartialUser }) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [newSkillName, setNewSkillName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const skillsList = userData?.skillsList || [];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setIsAdding(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/users/skills`,
        { name: newSkillName.trim() },
        { withCredentials: true }
      );
      updatePartialUser("skillsList", res.data.skillsList);
      setNewSkillName("");
      toast?.success?.("Skill added");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to add skill." });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${SERVER_URL}/api/users/skills/${id}`, {
        withCredentials: true,
      });
      updatePartialUser("skillsList", res.data.skillsList);
      toast?.success?.("Skill removed");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to remove skill." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="border-b border-slate-100 pb-3 mb-3.5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500 shrink-0" />
          <span>Technical Skills ({skillsList.length})</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Add or remove skills easily.
        </p>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
        <input
          type="text"
          maxLength={100}
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="e.g. Next.js, Docker, TypeScript..."
          className="flex-1 min-w-0 bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={isAdding || !newSkillName.trim()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition duration-200 disabled:opacity-50 shrink-0"
        >
          {isAdding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          <span>Add</span>
        </button>
      </form>

      {/* Skills Cloud */}
      {skillsList.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No skills added yet. Use the bar above to add your technical skills.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill) => {
            const isDeletingThis = deletingId === skill._id;
            return (
              <span
                key={skill._id}
                className={`group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-semibold transition duration-150 ${
                  isDeletingThis
                    ? "border-rose-300 bg-rose-50/50 text-slate-400 opacity-70"
                    : "border-slate-200 hover:border-purple-300 text-slate-800"
                }`}
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  disabled={isDeletingThis}
                  onClick={() => handleDeleteSkill(skill._id)}
                  title="Remove skill"
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
