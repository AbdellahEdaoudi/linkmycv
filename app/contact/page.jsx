"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../context/MyContext";
import { toast } from "../components/toast";
import { handleApiError } from "../utils/apiErrorHandler";
import {
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Send,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  LayoutDashboard,
  X,
  Plus,
} from "../components/lucide-react";
import MySentMessages from "./components/MySentMessages";

export default function ContactPage() {
  const router = useRouter();
  const { data } = useContext(MyContext);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  const [currentUser, setCurrentUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Sent Messages state synced with localStorage
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Form image attachment
  const [newMessageImage, setNewMessageImage] = useState(null);
  const [newMessageImagePreview, setNewMessageImagePreview] = useState(null);

  // Helper to persist contacts in localStorage
  const syncToLocalStorage = (updatedList) => {
    if (typeof window !== "undefined") {
      const uName = currentUser?.username || localStorage.getItem("username");
      if (uName) {
        try {
          const raw = localStorage.getItem(`data_${uName}`);
          const currentData = raw ? JSON.parse(raw) : {};
          currentData.contact = updatedList;
          localStorage.setItem(`data_${uName}`, JSON.stringify(currentData));
        } catch (e) {
          console.error("Failed to update contacts in localStorage", e);
        }
      }
    }
  };

  const handleUpsertContact = (doc) => {
    if (!doc?._id && !doc?.id) return;
    const id = doc._id || doc.id;
    setContacts((prev) => {
      const idx = prev.findIndex((c) => (c._id || c.id) === id);
      const next =
        idx === -1
          ? [doc, ...prev]
          : prev.map((c, i) => (i === idx ? { ...c, ...doc } : c));
      syncToLocalStorage(next);
      return next;
    });
  };

  const handleDeleteContactFromList = (id) => {
    setContacts((prev) => {
      const next = prev.filter((c) => (c._id || c.id) !== id);
      syncToLocalStorage(next);
      return next;
    });
  };

  // Enforce authentication & load contacts from localStorage
  useEffect(() => {
    let user = data?.user;
    let userContacts = data?.contact;

    if (typeof window !== "undefined") {
      try {
        const uName = localStorage.getItem("username");
        if (uName) {
          const stored = localStorage.getItem(`data_${uName}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!user) user = parsed.user;
            if (!userContacts) userContacts = parsed.contact;
          }
        }
      } catch {
        // fallback
      }
    }

    if (!user) {
      toast?.error?.("Registration is required to contact support. Please log in first.");
      router.push("/auth/login");
      return;
    }

    setCurrentUser(user);
    setContacts(Array.isArray(userContacts) ? userContacts : []);
    setCheckingAuth(false);
  }, [data, router]);

  // Fetch updated contact threads from server
  useEffect(() => {
    if (checkingAuth || !currentUser) return;
    const loadFromServer = async () => {
      setLoadingContacts(true);
      try {
        const res = await axios.get(`${SERVER_URL}/api/contacts`, {
          withCredentials: true,
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setContacts(list);
        syncToLocalStorage(list);
      } catch (error) {
        await handleApiError({
          error,
          toast,
          router,
          defaultErrorMsg: "Could not refresh your messages.",
        });
      } finally {
        setLoadingContacts(false);
      }
    };
    loadFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingAuth, currentUser?.username]);

  const clearNewMessageImage = () => {
    setNewMessageImage(null);
    if (newMessageImagePreview) URL.revokeObjectURL(newMessageImagePreview);
    setNewMessageImagePreview(null);
  };

  // Submit new contact inquiry
  const sendContact = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      return toast?.error?.("Please enter a subject.");
    }
    if (!message.trim()) {
      return toast?.error?.("Please enter a message.");
    }

    setLoading(true);
    const regex =
      /<script.*?>.*?<\/script>|<iframe.*?>.*?<\/iframe>|javascript:|eval\(|alert\(|document\.cookie|window\.location|<a\s+href=["']?javascript:.*?["']?/i;

    if (regex.test(subject) || regex.test(message)) {
      setLoading(false);
      toast?.error?.("Invalid characters or script detected.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("subject", subject.trim());
      fd.append("message", message.trim());
      if (newMessageImage) fd.append("image", newMessageImage);

      const res = await axios.post(`${SERVER_URL}/api/contacts`, fd, {
        withCredentials: true,
      });

      const newContact = res.data?.contact || res.data;
      if (newContact) handleUpsertContact(newContact);

      toast?.success?.("Message sent successfully!");
      setSubject("");
      setMessage("");
      clearNewMessageImage();
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 5000);
    } catch (error) {
      await handleApiError({
        error,
        toast,
        router,
        defaultErrorMsg: "An error occurred while sending the message.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-slate-50 antialiased pb-16 pt-6 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-6">
          {/* Header Card Skeleton */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-56" />
              <div className="h-3 bg-slate-100 rounded-md w-80" />
            </div>
            <div className="h-9 bg-slate-100 rounded-xl w-36" />
          </div>

          {/* Two-Column Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              </div>
            </aside>
            <main className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="h-4 bg-slate-200 rounded w-44" />
                <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl" />
                <div className="h-28 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 text-slate-800 antialiased pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Page Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Help & Contact Support
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide">
                Verified User
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Have a question, feedback, or need help with your live CV portfolio? Send us a message.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition duration-200 shadow-2xs"
          >
            <LayoutDashboard size={14} />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Direct Info & User Card */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Authenticated User Status Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Image
                  src={currentUser?.profileImage || currentUser?.urlimage || "/avatar.png"}
                  width={44}
                  height={44}
                  alt={currentUser?.fullname || "User avatar"}
                  className="w-11 h-11 aspect-square object-cover rounded-full border-2 border-purple-400"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {currentUser?.fullname}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    @{currentUser?.username}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Authenticated Account Verified</span>
              </div>
            </div>

            {/* Direct Contact Details Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Direct Contact Channels
              </h2>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Support Email</span>
                    <a
                      href="mailto:linkmycv.support@gmail.com"
                      className="font-semibold text-slate-800 hover:text-purple-600 transition"
                    >
                      linkmycv.support@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-green-50 text-green-600 border border-green-200 shrink-0">
                    {/* WhatsApp Icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.001 2C6.477 2 2 6.477 2 12.001c0 1.774.465 3.44 1.28 4.885L2.05 21.95l5.184-1.21A9.956 9.956 0 0 0 12.001 22C17.524 22 22 17.523 22 12.001 22 6.477 17.524 2 12.001 2zm0 1.8a8.2 8.2 0 1 1 0 16.4 8.196 8.196 0 0 1-4.07-1.085l-.292-.174-3.024.706.734-2.944-.19-.302A8.196 8.196 0 0 1 3.8 12.001a8.2 8.2 0 0 1 8.201-8.201zm-2.44 3.8c-.19 0-.497.071-.757.356-.26.285-1 .978-1 2.383s1.023 2.764 1.165 2.956c.142.19 1.993 3.19 4.92 4.348 2.436.961 2.928.77 3.457.722.53-.048 1.709-.698 1.95-1.374.241-.675.241-1.254.168-1.374-.071-.12-.262-.19-.547-.334-.285-.142-1.709-.844-1.973-.94-.264-.096-.456-.143-.648.143-.19.286-.739.94-.905 1.133-.167.19-.334.214-.619.072-.285-.143-1.204-.444-2.294-1.414-.848-.754-1.42-1.686-1.587-1.97-.166-.286-.018-.44.125-.582.128-.127.285-.334.428-.5.142-.167.19-.286.285-.477.096-.19.048-.358-.024-.5-.072-.143-.648-1.564-.887-2.14-.233-.56-.47-.484-.648-.493l-.55-.01z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Direct WhatsApp</span>
                    <a
                      href={`https://wa.me/212609085357?text=${encodeURIComponent("Hello, I'm from the LinkMyCV app.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 hover:text-green-600 transition"
                    >
                      +212 609 085 357
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">Headquarters</span>
                    <span className="font-semibold text-slate-800">
                      Laayoune, Morocco
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Send Form & Isolated MySentMessages */}
          <main className="lg:col-span-8 space-y-6">
            {/* Form Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={16} className="text-purple-600" />
                  <span>Send Support Message</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Replies from the support team will appear directly in your thread below.
                </p>
              </div>

              {sentSuccess && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Message sent and saved to your history!</p>
                  </div>
                </div>
              )}

              <form onSubmit={sendContact} className="space-y-4">
                {/* Subject Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Subject
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {subject.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={200}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiry about portfolio feature, Bug report, etc."
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Your Message
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {message.length}/5000
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={5}
                      maxLength={5000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you? Describe your inquiry or feedback in detail..."
                      required
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-3 pl-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed transition"
                    />
                    <MessageSquare className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
                  </div>
                </div>

                {/* Image attachment */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 cursor-pointer hover:text-purple-700">
                    <Plus size={14} />
                    Attach image (optional)
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setNewMessageImage(file);
                        if (newMessageImagePreview) URL.revokeObjectURL(newMessageImagePreview);
                        setNewMessageImagePreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                  {newMessageImagePreview && (
                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-2.5 py-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newMessageImagePreview}
                        alt="Preview"
                        className="h-9 w-9 rounded-lg object-cover border"
                      />
                      <span className="text-[11px] text-purple-700 font-medium truncate max-w-[150px]">
                        {newMessageImage?.name}
                      </span>
                      <button
                        type="button"
                        onClick={clearNewMessageImage}
                        className="text-slate-400 hover:text-slate-600 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-400">
                    Protected by linkmycv.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Isolated My Sent Messages Component */}
            <MySentMessages
              contacts={contacts}
              loadingContacts={loadingContacts}
              currentUser={currentUser}
              router={router}
              onUpsertContact={handleUpsertContact}
              onDeleteContact={handleDeleteContactFromList}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
