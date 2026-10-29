"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { User, CheckCheck, Loader2, Camera, Upload, X, Mail } from "../../components/lucide-react";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function ProfileSection({ userData, syncUserData }) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
    const [saving, setSaving] = useState(false);

  // Avatar upload state
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const avatarInputRef = useRef(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullname: userData?.fullname || "",
    username: userData?.username || "",
    email: userData?.email || "",
    specialization: userData?.specialization || "",
    country: userData?.country || "",
    phoneNumber: userData?.phoneNumber || "",
    summary: userData?.summary || "",
    github: userData?.socials?.github || userData?.github || "",
    linkedin: userData?.socials?.linkedin || userData?.Linkedin || userData?.linkedin || "",
    bgcolor: userData?.bgcolor || "#ffffff",
  });

  // Keep form in sync when userData updates or loads
  useEffect(() => {
    if (userData) {
      setProfileForm((prev) => ({
        ...prev,
        fullname: userData.fullname || "",
        username: userData.username || "",
        email: userData.email || "",
        specialization: userData.specialization || "",
        country: userData.country || "",
        phoneNumber: userData.phoneNumber || "",
        summary: userData.summary || "",
        github: userData.socials?.github || userData.github || "",
        linkedin: userData.socials?.linkedin || userData.Linkedin || userData.linkedin || "",
        bgcolor: userData.bgcolor || "#ffffff",
      }));
    }
  }, [userData]);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast?.error?.("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    let finalFile = file;

    // Compress image if larger than 800KB
    if (file.size > 800 * 1024) {
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.8, // Target size under 800KB
          maxWidthOrHeight: 1200, // Max dimension
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);
        finalFile = new File([compressedBlob], file.name, { type: compressedBlob.type || file.type });
        toast?.success?.(`Image compressed from ${(file.size / (1024 * 1024)).toFixed(1)}MB to ${(finalFile.size / 1024).toFixed(0)}KB`);
      } catch (err) {
        console.warn("Compression skipped or failed, using original file:", err);
      } finally {
        setIsCompressing(false);
      }
    }

    if (finalFile.size > 5 * 1024 * 1024) {
      toast?.error?.("Image file size must be less than 5MB.");
      return;
    }

    setSelectedAvatarFile(finalFile);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(finalFile);
  };

  const handleUploadAvatar = async () => {
    if (!selectedAvatarFile) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", selectedAvatarFile);

    try {
      const res = await axios.put(`${SERVER_URL}/api/users/avatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data?.user || { ...userData, profileImage: res.data?.profileImage };
      syncUserData(updatedUser);
      setSelectedAvatarFile(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      toast?.success?.("Profile image updated! Previous image deleted from Cloudinary.");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to upload profile image." });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const cancelAvatarSelection = () => {
    setSelectedAvatarFile(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Client-side username validation
    const cleanUName = (profileForm.username || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9._-]/g, "");

    if (!cleanUName || cleanUName.length < 3 || cleanUName.length > 30) {
      toast?.error?.("Username must be between 3 and 30 characters (letters, numbers, ., -, _)");
      return;
    }

    // Client-side email validation if entered
    if (profileForm.email && profileForm.email.trim() !== "") {
      if (profileForm.email.trim().length > 100) {
        toast?.error?.("Email address cannot exceed 100 characters");
        return;
      }
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(profileForm.email.trim())) {
        toast?.error?.("Please enter a valid email address (e.g. name@example.com)");
        return;
      }
    }

    // Client-side phone validation if entered
    if (profileForm.phoneNumber && profileForm.phoneNumber.trim() !== "") {
      const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}$/;
      if (!phoneRegex.test(profileForm.phoneNumber.trim())) {
        toast?.error?.("Please enter a valid phone number (e.g. +212 609 085 357)");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/users/profile`,
        {
          fullname: profileForm.fullname,
          username: cleanUName,
          email: profileForm.email ? profileForm.email.trim().toLowerCase() : "",
          specialization: profileForm.specialization,
          country: profileForm.country,
          phoneNumber: profileForm.phoneNumber,
          summary: profileForm.summary,
          bgcolor: profileForm.bgcolor,
          socials: {
            github: profileForm.github,
            linkedin: profileForm.linkedin,
          },
          github: profileForm.github,
          linkedin: profileForm.linkedin,
        },
        { withCredentials: true }
      );

      // If username changed, update localStorage username key
      if (res.data?.user?.username && typeof window !== "undefined") {
        const oldUsername = localStorage.getItem("username");
        const newUsername = res.data.user.username;
        if (oldUsername && oldUsername !== newUsername) {
          localStorage.setItem("username", newUsername);
          try {
            const oldData = localStorage.getItem(`data_${oldUsername}`);
            if (oldData) {
              localStorage.setItem(`data_${newUsername}`, oldData);
              localStorage.removeItem(`data_${oldUsername}`);
            }
          } catch {
            // ignore
          }
        }
      }

      syncUserData(res.data.user);
      toast?.success?.("Profile updated successfully!");
    } catch (err) {
      await handleApiError({ error: err, toast, defaultErrorMsg: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-5">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User size={16} className="text-purple-600 shrink-0" />
            <span>Personal Information & Social Links</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Updates your headline, contact details, bio, and social handles.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition duration-200 disabled:opacity-50 self-start sm:self-auto shrink-0"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* ── Compact Profile Picture Card ── */}
      <div className="bg-gradient-to-r from-purple-50/60 via-slate-50 to-indigo-50/50 border border-purple-100 rounded-2xl p-3 sm:p-4 flex items-center gap-3.5">
        <div className="relative group cursor-pointer shrink-0" onClick={() => avatarInputRef.current?.click()}>
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-purple-500/80 shadow-xs bg-purple-100 relative">
            <Image
              src={avatarPreview || userData?.profileImage || userData?.urlimage || "/avatar.png"}
              alt={userData?.fullname || "Profile avatar"}
              fill
              sizes="(max-width: 640px) 56px, 80px"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-slate-950/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200">
            <Camera size={16} />
            <span className="text-[9px] font-medium">Edit</span>
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleAvatarFileChange}
          className="hidden"
        />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs font-bold text-slate-900">Profile Photo</h3>
            {isCompressing ? (
              <span className="bg-amber-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Loader2 size={10} className="animate-spin" />
                Compressing...
              </span>
            ) : selectedAvatarFile ? (
              <span className="bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                New Photo Ready
              </span>
            ) : (
              <span className="bg-slate-200/80 text-slate-600 text-[9px] font-medium px-2 py-0.5 rounded-full">
                Cloudinary
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 sm:line-clamp-none">
            {selectedAvatarFile
              ? `Selected: "${selectedAvatarFile.name}" (${(selectedAvatarFile.size / 1024).toFixed(0)} KB)`
              : "Upload JPG, PNG or WEBP. Automatically optimized before upload."}
          </p>

          <div className="pt-0.5 flex items-center gap-2 flex-wrap">
            {selectedAvatarFile ? (
              <>
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition duration-200 disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={12} />
                      <span>Save Photo</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelAvatarSelection}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition duration-200"
                >
                  <X size={12} />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs transition duration-200"
              >
                <Camera size={12} className="text-purple-600" />
                <span>Change Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <span className="text-[10px] text-slate-400">{profileForm.fullname.length}/50</span>
          </div>
          <input
            type="text"
            maxLength={50}
            value={profileForm.fullname}
            onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })}
            required
            placeholder="e.g. Abdellah Edaoudi"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>

        {/* Username */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Username (Portfolio URL)</label>
            <span className="text-[10px] text-slate-400">{profileForm.username.length}/30</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">
              @
            </span>
            <input
              type="text"
              maxLength={30}
              value={profileForm.username}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""),
                })
              }
              required
              placeholder="username"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <span className="text-[10px] text-slate-400">{profileForm.email.length}/100</span>
          </div>
          <input
            type="email"
            maxLength={100}
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            placeholder="e.g. contact@example.com"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Specialization / Headline</label>
            <span className="text-[10px] text-slate-400">{profileForm.specialization.length}/100</span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={profileForm.specialization}
            onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
            placeholder="e.g. Full Stack Web Developer"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Location (City, Country)</label>
            <span className="text-[10px] text-slate-400">{profileForm.country.length}/60</span>
          </div>
          <input
            type="text"
            maxLength={60}
            value={profileForm.country}
            onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
            placeholder="e.g. Laayoune, Morocco"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Phone Number (WhatsApp / Call)</label>
            <span className="text-[10px] text-slate-400">{profileForm.phoneNumber.length}/25</span>
          </div>
          <input
            type="tel"
            maxLength={25}
            value={profileForm.phoneNumber}
            onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
            placeholder="e.g. +212 609 085 357"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Summary (About Me)
          </label>
          <span className="text-[10px] text-slate-400">
            {profileForm.summary.length}/1000
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={1000}
          value={profileForm.summary}
          onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
          placeholder="Describe your background, years of experience, core tech stack, and accomplishments..."
          className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed transition"
        />
      </div>

      {/* Social Links (GitHub & LinkedIn) */}
      <div className="pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 mb-3">Social Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">GitHub URL</label>
            <input
              type="url"
              maxLength={200}
              value={profileForm.github}
              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
              placeholder="https://github.com/AbdellahEdaoudi"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn URL</label>
            <input
              type="url"
              maxLength={200}
              value={profileForm.linkedin}
              onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/abdellah-edaoudi"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
