"use client";
import React, { useState } from "react";
import axios from "axios";
import { Briefcase, Plus, Pencil, Trash2, X, Loader2 } from "../../components/lucide-react";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function ExperienceSection({ userData, updatePartialUser }) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    id: null,
    title: "",
  });

  const experiences = userData?.experiences || [];

  const formatShortDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingId(exp._id);
    const startStr = exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "";
    const endStr = exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "";
    setForm({
      position: exp.position || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: startStr,
      endDate: endStr,
      current: Boolean(exp.current),
      description: exp.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await axios.put(
          `${SERVER_URL}/api/users/experiences/${editingId}`,
          form,
          { withCredentials: true }
        );
        updatePartialUser("experiences", res.data.experiences);
        toast?.success?.("Experience updated successfully!");
      } else {
        const res = await axios.post(
          `${SERVER_URL}/api/users/experiences`,
          form,
          { withCredentials: true }
        );
        updatePartialUser("experiences", res.data.experiences);
        toast?.success?.("Experience added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to save experience." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${SERVER_URL}/api/users/experiences/${id}`, {
        withCredentials: true,
      });
      updatePartialUser("experiences", res.data.experiences);
      toast?.success?.("Experience deleted");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to delete experience." });
    } finally {
      setDeleteDialog({ isOpen: false, id: null, title: "" });
    }
  };

  return (
    <div>
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-600 shrink-0" />
            <span>Work Experiences ({experiences.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, or remove your professional positions.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition duration-200 self-start sm:self-auto shrink-0"
        >
          <Plus size={14} />
          <span>Add Experience</span>
        </button>
      </div>

      {/* ── List of Experiences ── */}
      {experiences.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No experience records found. Click &quot;Add Experience&quot; to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 sm:p-4 flex items-start justify-between gap-2.5 group hover:border-slate-300 transition duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{exp.position}</h3>
                  {exp.current && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] sm:text-xs text-slate-500">
                  <span className="text-slate-800 font-semibold">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-mono text-[10px] sm:text-xs">
                    {formatShortDate(exp.startDate)} — {exp.current ? "Present" : formatShortDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1.5 text-[11px] sm:text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(exp)}
                  title="Edit"
                  className="p-1 sm:p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition duration-150"
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      id: exp._id,
                      title: `${exp.position} at ${exp.company}`,
                    })
                  }
                  title="Delete"
                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition duration-150"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Experience Modal (Add / Edit) ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-2xl relative text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {editingId ? "Edit Experience" : "Add Work Experience"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Position / Role</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. DGT Portfolio"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Remote or Laayoune, Morocco"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={form.current}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCurrent_sec"
                  checked={form.current}
                  onChange={(e) => setForm({ ...form, current: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="expCurrent_sec" className="text-xs text-slate-700 select-none cursor-pointer font-medium">
                  I currently work here
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Description / Responsibilities
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {form.description.length}/1000
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="• Built features...&#10;• Developed APIs..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition duration-150 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Experience"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deleteDialog.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteDialog({ isOpen: false, id: null, title: "" })}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-sm shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm text-slate-900 mb-2">Confirm Delete</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{deleteDialog.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, id: null, title: "" })}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteDialog.id)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
