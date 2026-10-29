"use client";
import React, { useState } from "react";
import axios from "axios";
import { GraduationCap, Plus, Pencil, Trash2, X, Loader2 } from "../../components/lucide-react";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function EducationSection({ userData, updatePartialUser }) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
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

  const educations = userData?.educations || [];

  const formatShortDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      degree: "",
      institution: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingId(edu._id);
    const startStr = edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "";
    const endStr = edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "";
    setForm({
      degree: edu.degree || "",
      institution: edu.institution || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: startStr,
      endDate: endStr,
      current: Boolean(edu.current),
      description: edu.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await axios.put(
          `${SERVER_URL}/api/users/educations/${editingId}`,
          form,
          { withCredentials: true }
        );
        updatePartialUser("educations", res.data.educations);
        toast?.success?.("Education updated successfully!");
      } else {
        const res = await axios.post(
          `${SERVER_URL}/api/users/educations`,
          form,
          { withCredentials: true }
        );
        updatePartialUser("educations", res.data.educations);
        toast?.success?.("Education added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to save education." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${SERVER_URL}/api/users/educations/${id}`, {
        withCredentials: true,
      });
      updatePartialUser("educations", res.data.educations);
      toast?.success?.("Education deleted");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to delete education." });
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
            <GraduationCap size={16} className="text-indigo-600 shrink-0" />
            <span>Education & Degrees ({educations.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage diplomas, degrees, and academic qualifications.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition duration-200 self-start sm:self-auto shrink-0"
        >
          <Plus size={14} />
          <span>Add Education</span>
        </button>
      </div>

      {/* ── List of Educations ── */}
      {educations.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No education records found. Click &quot;Add Education&quot; to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu._id}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 sm:p-4 flex items-start justify-between gap-2.5 group hover:border-slate-300 transition duration-200"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {edu.degree} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ""}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] sm:text-xs text-slate-500">
                  <span className="text-slate-800 font-semibold">{edu.institution}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-mono text-[10px] sm:text-xs">
                    {formatShortDate(edu.startDate)} — {edu.current ? "Present" : formatShortDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-1.5 text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(edu)}
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
                      id: edu._id,
                      title: `${edu.degree} (${edu.institution})`,
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

      {/* ── Education Modal (Add / Edit) ── */}
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
                {editingId ? "Edit Education" : "Add Education"}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Diploma</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    placeholder="e.g. Specialized Technician (DTS)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="e.g. CMC Laayoune"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.fieldOfStudy}
                  onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Digital Development — Full Stack Web"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={form.current}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Location</label>
                <input
                  type="text"
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Laayoune, Morocco"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
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
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition duration-150 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Education"}</span>
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
