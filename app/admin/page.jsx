"use client";

import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MyContext } from "../context/MyContext";
import { toast } from "../components/toast";
import { handleApiError } from "../utils/apiErrorHandler";
import {
  Shield,
  ShieldAlert,
  Users,
  Mail,
  Trash2,
  Search,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Loader2,
  X,
  MapPin,
  ArrowRight,
  Pencil,
  Plus,
} from "../components/lucide-react";

// ── Custom SVG Icon Helpers ─────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.53 1.77.813 2.791.814 3.18 0 5.766-2.587 5.767-5.767.001-3.181-2.585-5.766-5.767-5.769zm3.435 8.163c-.144.404-.836.774-1.17.824-.311.047-.709.074-2.285-.579-1.916-.796-3.14-2.756-3.236-2.885-.095-.128-.774-1.03-.774-1.964 0-.934.489-1.393.663-1.583.174-.191.38-.239.507-.239.127 0 .254.001.365.006.118.005.276-.044.432.331.161.385.553 1.349.601 1.448.048.098.08.214.016.342-.064.128-.096.208-.191.319-.095.111-.202.248-.288.333-.095.096-.195.2-.084.391.111.191.494.814 1.059 1.318.728.649 1.342.85 1.533.945.191.096.302.08.414-.048.111-.128.477-.556.604-.746.127-.19.254-.159.429-.095.175.064 1.111.524 1.302.62.19.095.318.143.365.222.048.08.048.462-.096.866z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.662 1.438 5.176L2 22l4.965-1.398A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.16 8.16 0 0 1-4.162-1.137l-.298-.177-3.085.869.876-3.007-.194-.31A8.165 8.165 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2 4.522 0 8.2 3.679 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"
    />
  </svg>
);

const SendIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const MessageSquareIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const cleanPhone = (phone) => (phone || "").replace(/[\s+\-().]/g, "");

// Shared neutral icon-button style (single look for all quick actions)
const iconBtn =
  "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition";

function ExpandableText({ text, isAdmin = false }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const showToggle = text.length > 200 || text.split("\n").length > 4;

  return (
    <div>
      <p
        className={`whitespace-pre-wrap leading-relaxed break-words ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`text-[11px] font-semibold mt-1 hover:underline inline-block ${
            isAdmin ? "text-purple-200 hover:text-white" : "text-purple-600 hover:text-purple-700"
          }`}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data } = useContext(MyContext);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

  // Auth & Permissions State
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);

  // Active Tab: 'users' | 'contacts'
  const [activeTab, setActiveTab] = useState("users");

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalContacts: 0,
    recentUsers: [],
  });
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);

  // UI / Loading States
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");

  // Communication & Chat State
  const [selectedContact, setSelectedContact] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Modals & Action States
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Confirm",
    isDanger: true,
  });
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [confirmActionLoading, setConfirmActionLoading] = useState(false);

  // Reply Draft State
  const [adminReplyText, setAdminReplyText] = useState("");
  const [adminReplyImage, setAdminReplyImage] = useState(null);
  const [adminReplyPreview, setAdminReplyPreview] = useState(null);
  const [sendingAdminReply, setSendingAdminReply] = useState(false);

  // Edit and Delete State for Individual Replies
  const [editingReply, setEditingReply] = useState(null);
  const [isUpdatingReply, setIsUpdatingReply] = useState(false);
  const [deleteReplyModal, setDeleteReplyModal] = useState(null);
  const [isDeletingReply, setIsDeletingReply] = useState(false);

  // Image preview modal
  const [imageModal, setImageModal] = useState(null); // image url string

  // Close image modal with Escape
  useEffect(() => {
    if (!imageModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setImageModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageModal]);

  // ── Helper to retrieve user from context or localStorage ──────────────────
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

  // ── Check Admin Permissions On Mount ──────────────────────────────────────
  useEffect(() => {
    const user = data?.user || readUser();
    setCurrentUser(user);
    setCheckingAuth(false);

    if (!user) {
      setIsForbidden(true);
      return;
    }

    if (user.role !== "admin") {
      setIsForbidden(true);
    } else {
      setIsForbidden(false);
      fetchAllAdminData();
    }
  }, [data?.user]);

  // Keep selectedContact synchronized with updated contacts array
  useEffect(() => {
    if (selectedContact) {
      const fresh = contacts.find((c) => c._id === selectedContact._id);
      if (fresh) setSelectedContact(fresh);
    }
  }, [contacts]);

  // Scroll messages to bottom when a conversation changes
  useEffect(() => {
    if (selectedContact && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedContact?._id, selectedContact?.messages?.length]);

  // ── Fetch Operations ──────────────────────────────────────────────────────
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (error) {
      handleApiError({
        error,
        retryCallback: fetchStats,
        defaultErrorMsg: "Failed to load admin statistics",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/users`, { withCredentials: true });
      setUsers(res.data || []);
    } catch (error) {
      handleApiError({
        error,
        retryCallback: fetchUsers,
        defaultErrorMsg: "Failed to load users list",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/contacts`, { withCredentials: true });
      const dataContacts = res.data || [];
      setContacts(dataContacts);
      if (!selectedContact && dataContacts.length > 0 && typeof window !== "undefined" && window.innerWidth >= 1024) {
        setSelectedContact(dataContacts[0]);
      }
    } catch (error) {
      handleApiError({
        error,
        retryCallback: fetchContacts,
        defaultErrorMsg: "Failed to load contact messages",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchAllAdminData = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchContacts()]);
    setRefreshing(false);
  };

  // ── User Management Handlers ──────────────────────────────────────────────
  const handleToggleRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const isDemoting = newRole === "user";

    setConfirmModal({
      isOpen: true,
      title: isDemoting ? "Demote Admin?" : "Promote to Admin?",
      message: isDemoting
        ? `Are you sure you want to revoke admin permissions for "${user.fullname || user.username}"?`
        : `Are you sure you want to grant full administrator rights to "${user.fullname || user.username}"?`,
      confirmText: isDemoting ? "Revoke Admin" : "Grant Admin",
      isDanger: isDemoting,
      onConfirm: async () => {
        setConfirmActionLoading(true);
        try {
          const res = await axios.put(
            `${SERVER_URL}/api/admin/users/${user._id}/role`,
            { role: newRole },
            { withCredentials: true }
          );
          toast.success(res.data?.message || "Role updated successfully");
          setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
          fetchStats();
        } catch (error) {
          handleApiError({
            error,
            defaultErrorMsg: "Failed to update user role",
            toast,
            router,
            setIsForbidden,
          });
        } finally {
          setConfirmActionLoading(false);
          setConfirmModal((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete User Account",
      message: `Permanently delete account for "${user.fullname || user.username}"? This will remove all their portfolio data and inquiries. This action cannot be undone.`,
      confirmText: "Delete Account",
      isDanger: true,
      onConfirm: async () => {
        setConfirmActionLoading(true);
        setActionLoadingId(user._id);
        try {
          const res = await axios.delete(`${SERVER_URL}/api/admin/users/${user._id}`, {
            withCredentials: true,
          });
          toast.success(res.data?.message || "User deleted successfully");
          setUsers((prev) => prev.filter((u) => u._id !== user._id));
          fetchStats();
          fetchContacts();
        } catch (error) {
          handleApiError({
            error,
            defaultErrorMsg: "Failed to delete user",
            toast,
            router,
            setIsForbidden,
          });
        } finally {
          setConfirmActionLoading(false);
          setActionLoadingId(null);
          setConfirmModal((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  // ── Communication & Reply Handlers ────────────────────────────────────────
  const clearAdminReplyDraft = () => {
    setAdminReplyText("");
    setAdminReplyImage(null);
    if (adminReplyPreview) URL.revokeObjectURL(adminReplyPreview);
    setAdminReplyPreview(null);
  };

  const handleAdminReply = async () => {
    if (!selectedContact?._id || !adminReplyText.trim()) return;
    setSendingAdminReply(true);
    try {
      const fd = new FormData();
      fd.append("message", adminReplyText.trim());
      if (adminReplyImage) fd.append("image", adminReplyImage);
      const res = await axios.post(
        `${SERVER_URL}/api/admin/contacts/${selectedContact._id}/replies`,
        fd,
        { withCredentials: true }
      );
      const updated = res.data?.contact;
      if (updated) {
        setSelectedContact(updated);
        setContacts((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      }
      toast.success("Reply sent successfully");
      clearAdminReplyDraft();
    } catch (error) {
      handleApiError({
        error,
        defaultErrorMsg: "Failed to send reply",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setSendingAdminReply(false);
    }
  };

  const startEditingReply = (contactId, msg) => {
    setEditingReply({
      contactId,
      messageId: msg._id,
      text: msg.message || "",
      currentImageUrl: msg.imageUrl || null,
      newImageFile: null,
      newPreviewUrl: null,
      removeImage: false,
    });
  };

  const cancelEditingReply = () => {
    if (editingReply?.newPreviewUrl) {
      URL.revokeObjectURL(editingReply.newPreviewUrl);
    }
    setEditingReply(null);
  };

  const handleSaveEditedReply = async () => {
    if (!editingReply) return;
    const text = (editingReply.text || "").trim();
    if (!text) {
      toast.error("Reply text cannot be empty");
      return;
    }

    setIsUpdatingReply(true);
    try {
      const fd = new FormData();
      fd.append("message", text);
      if (editingReply.newImageFile) {
        fd.append("image", editingReply.newImageFile);
      } else if (editingReply.removeImage) {
        fd.append("removeImage", "true");
      }

      const res = await axios.put(
        `${SERVER_URL}/api/admin/contacts/${editingReply.contactId}/replies/${editingReply.messageId}`,
        fd,
        { withCredentials: true }
      );

      const updated = res.data?.contact || res.data;
      if (updated) {
        setSelectedContact(updated);
        setContacts((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      }
      toast.success("Reply updated successfully");
      cancelEditingReply();
    } catch (error) {
      handleApiError({
        error,
        defaultErrorMsg: "Failed to update reply",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setIsUpdatingReply(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!deleteReplyModal) return;
    const { contactId, messageId } = deleteReplyModal;
    setIsDeletingReply(true);
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/admin/contacts/${contactId}/replies/${messageId}`,
        { withCredentials: true }
      );

      const updated = res.data?.contact || res.data;
      if (updated) {
        setSelectedContact(updated);
        setContacts((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      }
      toast.success("Reply marked as deleted");
    } catch (error) {
      handleApiError({
        error,
        defaultErrorMsg: "Failed to delete reply",
        toast,
        router,
        setIsForbidden,
      });
    } finally {
      setDeleteReplyModal(null);
      setIsDeletingReply(false);
    }
  };

  const handleDeleteContact = (contactId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Inquiry Conversation",
      message:
        "Are you sure you want to permanently delete this message thread and all attachments? This action cannot be undone.",
      confirmText: "Delete Thread",
      isDanger: true,
      onConfirm: async () => {
        setConfirmActionLoading(true);
        setActionLoadingId(contactId);
        try {
          const res = await axios.delete(`${SERVER_URL}/api/admin/contacts/${contactId}`, {
            withCredentials: true,
          });
          toast.success(res.data?.message || "Conversation deleted");
          setContacts((prev) => prev.filter((c) => c._id !== contactId));
          fetchStats();
          if (selectedContact?._id === contactId) {
            setSelectedContact(null);
            setMobileChatOpen(false);
          }
        } catch (error) {
          handleApiError({
            error,
            defaultErrorMsg: "Failed to delete contact message",
            toast,
            router,
            setIsForbidden,
          });
        } finally {
          setConfirmActionLoading(false);
          setActionLoadingId(null);
          setConfirmModal((c) => ({ ...c, isOpen: false }));
        }
      },
    });
  };

  // ── Filtered User List ────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const term = userSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.fullname?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phoneNumber?.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearch]);

  // ── Filtered Contacts & Calculation ───────────────────────────────────────
  const pendingCount = useMemo(
    () => contacts.filter((c) => !c.messages?.some((m) => m.senderRole === "admin")).length,
    [contacts]
  );
  const repliedCount = useMemo(() => contacts.length - pendingCount, [contacts, pendingCount]);

  const filteredContacts = useMemo(() => {
    const term = contactSearch.toLowerCase().trim();
    return contacts.filter((c) => {
      const isReplied = c.messages?.some((m) => m.senderRole === "admin");
      if (contactStatusFilter === "pending" && isReplied) return false;
      if (contactStatusFilter === "replied" && !isReplied) return false;

      if (!term) return true;
      const subjectMatch = c.subject?.toLowerCase().includes(term);
      const messageMatch =
        c.message?.toLowerCase().includes(term) ||
        (c.messages || []).some((m) => m.message?.toLowerCase().includes(term));
      const userMatch =
        c.user?.fullname?.toLowerCase().includes(term) ||
        c.user?.username?.toLowerCase().includes(term) ||
        c.user?.email?.toLowerCase().includes(term) ||
        c.user?.phoneNumber?.toLowerCase().includes(term);
      return subjectMatch || messageMatch || userMatch;
    });
  }, [contacts, contactSearch, contactStatusFilter]);

  // ── Render Access Denied State ───────────────────────────────────────────
  if (checkingAuth) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-slate-500 animate-spin mb-3" />
        <h2 className="text-base font-bold text-slate-800">Verifying Administrator Privileges...</h2>
      </div>
    );
  }

  if (isForbidden || currentUser?.role !== "admin") {
    return (
      <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            You do not have administrative privileges to view this section. Only verified platform
            administrators can access the LinkMyCV Administration Dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Layout: fills the viewport, only inner lists scroll ──────────────
  return (
    <div className="h-[calc(100dvh-4rem)] bg-slate-50 max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col gap-3 overflow-hidden">
      {/* ── Top bar: tabs + refresh ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          {[
            { id: "users", label: "Users", icon: Users, count: users.length },
            {
              id: "contacts",
              label: "Inquiries",
              icon: Mail,
              count: pendingCount > 0 ? `${pendingCount} pending` : contacts.length,
            },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Icon size={14} />
              <span>{label}</span>
              <span className="text-[10px] font-bold text-slate-500">{count}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={fetchAllAdminData}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── TAB 1: USERS ────────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-200 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, username, email, phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-slate-400 transition"
              />
              {userSearch && (
                <button
                  onClick={() => setUserSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
              {[
                { id: "all", label: "All" },
                { id: "admin", label: "Admins" },
                { id: "user", label: "Users" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setUserRoleFilter(id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${userRoleFilter === id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table (header stays fixed, rows scroll only if they don't fit) */}
          {loadingUsers ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-7 h-7 text-slate-500 animate-spin mb-2" />
              <p className="text-xs">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Users size={30} className="mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Contact</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4 hidden md:table-cell">Joined</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSelf =
                      currentUser?._id === u._id || currentUser?.username === u.username;
                    const isActing = actionLoadingId === u._id;
                    const phoneClean = cleanPhone(u.phoneNumber);

                    return (
                      <tr key={u._id} className="hover:bg-slate-50 transition">
                        {/* User */}
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <Image
                                src={u.profileImage || "/avatar.png"}
                                alt={u.fullname || "User"}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              {u.isOnline && (
                                <span
                                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"
                                  title="Online"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                                <span className="truncate max-w-[140px]">
                                  {u.fullname || "Unnamed User"}
                                </span>
                                {isSelf && (
                                  <span className="text-[9px] font-bold px-1.5 rounded bg-slate-200 text-slate-700">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                @{u.username || "no-username"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-2 px-4">
                          <div className="flex flex-col gap-0.5 text-[11px]">
                            {u.email ? (
                              <a
                                href={`mailto:${u.email}?subject=${encodeURIComponent("Message from LinkMyCV Administrator")}`}
                                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 truncate max-w-[200px]"
                                title={`Email ${u.email}`}
                              >
                                <Mail size={12} className="text-slate-400 shrink-0" />
                                <span className="truncate">{u.email}</span>
                              </a>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                            {phoneClean ? (
                              <a
                                href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hello ${u.fullname || ""}, this is the LinkMyCV Admin team reaching out.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                                title="Open WhatsApp"
                              >
                                <WhatsAppIcon size={12} className="text-slate-400 shrink-0" />
                                <span>{u.phoneNumber}</span>
                              </a>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </div>
                        </td>

                        {/* Role + country */}
                        <td className="py-2 px-4">
                          <div className="flex flex-col gap-0.5 items-start">
                            {u.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white">
                                <Shield size={10} />
                                Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                User
                              </span>
                            )}
                            {u.country && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <MapPin size={10} />
                                {u.country}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="py-2 px-4 text-[11px] text-slate-500 whitespace-nowrap hidden md:table-cell">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                            : "-"}
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {u.username && (
                              <Link
                                href={`/${u.username}`}
                                target="_blank"
                                className={iconBtn}
                                title="View Live CV"
                              >
                                <ExternalLink size={14} />
                              </Link>
                            )}

                            {!isSelf && (
                              <button
                                onClick={() => handleToggleRole(u)}
                                disabled={isActing}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition disabled:opacity-60"
                              >
                                {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                              </button>
                            )}

                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                disabled={isActing}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-60"
                                title="Delete User Account"
                              >
                                {isActing ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: INQUIRIES (split pane, fills remaining height) ───────── */}
      {activeTab === "contacts" && (
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: list */}
          <div
            className={`w-full lg:w-80 xl:w-96 shrink-0 border-r border-slate-200 flex flex-col min-h-0 ${mobileChatOpen ? "hidden lg:flex" : "flex"
              }`}
          >
            <div className="p-3 border-b border-slate-200 space-y-2 shrink-0">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter subject, user, email..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-slate-400 transition"
                />
                {contactSearch && (
                  <button
                    onClick={() => setContactSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-center">
                {[
                  { id: "all", label: `All (${contacts.length})` },
                  { id: "pending", label: `Pending (${pendingCount})` },
                  { id: "replied", label: `Replied (${repliedCount})` },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setContactStatusFilter(id)}
                    className={`py-1 rounded-md text-[11px] font-semibold transition ${contactStatusFilter === id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
              {loadingContacts ? (
                <div className="py-16 flex flex-col items-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-xs">Loading...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="py-16 text-center px-4 text-slate-400">
                  <Mail size={28} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No inquiries found</p>
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedContact?._id === contact._id;
                  const hasAdminReply = contact.messages?.some((m) => m.senderRole === "admin");
                  const lastMsg =
                    contact.messages && contact.messages.length > 0
                      ? contact.messages[contact.messages.length - 1]
                      : null;

                  return (
                    <div
                      key={contact._id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setMobileChatOpen(true);
                        clearAdminReplyDraft();
                        cancelEditingReply();
                      }}
                      className={`px-3 py-2.5 cursor-pointer transition flex flex-col gap-1 border-l-2 ${isSelected
                          ? "bg-slate-100 border-l-purple-600"
                          : "hover:bg-slate-50 border-l-transparent"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Image
                            src={contact.user?.profileImage || "/avatar.png"}
                            alt={contact.user?.fullname || "Sender"}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-semibold text-slate-900 text-xs truncate">
                            {contact.user?.fullname || "Anonymous User"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!hasAdminReply && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-rose-500"
                              title="Needs reply"
                            />
                          )}
                          <span className="text-[10px] text-slate-400">
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })
                              : ""}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-700 line-clamp-1">
                        {contact.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {lastMsg?.message || contact.message || "No content"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: conversation */}
          <div
            className={`flex-1 min-w-0 min-h-0 flex flex-col bg-white ${!mobileChatOpen ? "hidden lg:flex" : "flex"
              }`}
          >
            {selectedContact ? (
              <div className="flex flex-col h-full min-h-0">
                {/* Header */}
                <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileChatOpen(false)}
                      className="lg:hidden p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition shrink-0"
                      title="Back"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                    </button>

                    <Image
                      src={selectedContact.user?.profileImage || "/avatar.png"}
                      alt={selectedContact.user?.fullname || "Sender"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {selectedContact.user?.fullname || "Anonymous User"}
                        </h3>
                        {selectedContact.user?.country && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <MapPin size={9} />
                            {selectedContact.user.country}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        @{selectedContact.user?.username || "no-username"}
                        {selectedContact.user?.email && <> &bull; {selectedContact.user.email}</>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    {selectedContact.user?.phoneNumber && (
                      <a
                        href={`https://wa.me/${cleanPhone(selectedContact.user.phoneNumber)}?text=${encodeURIComponent(
                          `Hello ${selectedContact.user?.fullname || ""}, this is the LinkMyCV Admin regarding your inquiry: "${selectedContact.subject}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={iconBtn}
                        title={`WhatsApp ${selectedContact.user.phoneNumber}`}
                      >
                        <WhatsAppIcon size={15} />
                      </a>
                    )}
                    {selectedContact.user?.email && (
                      <a
                        href={`mailto:${selectedContact.user.email}?subject=${encodeURIComponent(
                          `LinkMyCV Support: Re: ${selectedContact.subject}`
                        )}&body=${encodeURIComponent(
                          `Hello ${selectedContact.user?.fullname || ""},\n\nRegarding your inquiry on LinkMyCV: "${selectedContact.subject}"\n\n`
                        )}`}
                        className={iconBtn}
                        title={`Email ${selectedContact.user.email}`}
                      >
                        <Mail size={15} />
                      </a>
                    )}
                    {selectedContact.user?.username && (
                      <Link
                        href={`/${selectedContact.user.username}`}
                        target="_blank"
                        className={iconBtn}
                        title="View Live CV"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(selectedContact._id)}
                      disabled={actionLoadingId === selectedContact._id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Conversation Thread"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Subject line */}
                <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
                  <h2 className="font-semibold text-slate-800 truncate">{selectedContact.subject}</h2>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {selectedContact.createdAt
                      ? new Date(selectedContact.createdAt).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : ""}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                  {(Array.isArray(selectedContact.messages) && selectedContact.messages.length > 0
                    ? selectedContact.messages
                    : [
                      {
                        _id: "init",
                        sender: selectedContact.user,
                        senderRole: "user",
                        message: selectedContact.message || "",
                        imageUrl: selectedContact.imageUrl,
                        createdAt: selectedContact.createdAt,
                      },
                    ]
                  ).map((msg, index) => {
                    const msgId = msg._id || `msg-${index}`;
                    const isAdmin = msg.senderRole === "admin";
                    const isDeleted = Boolean(msg.isDeleted);
                    const isBeingEdited = editingReply?.messageId === msgId;

                    const senderUser =
                      msg.sender && typeof msg.sender === "object" ? msg.sender : null;
                    const senderAvatar = isAdmin
                      ? "/logo.png"
                      : senderUser?.profileImage || selectedContact.user?.profileImage || "/avatar.png";
                    const senderName = isAdmin
                      ? "LinkMyCV Support"
                      : senderUser?.fullname || selectedContact.user?.fullname || "User";

                    return (
                      <div
                        key={msgId}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs ${isAdmin
                              ? "bg-purple-600 text-white rounded-tr-sm"
                              : isDeleted
                                ? "bg-slate-100 border border-dashed border-slate-300 text-slate-400 rounded-tl-sm"
                                : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
                            }`}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <div className="flex items-center gap-1.5">
                              <Image
                                src={senderAvatar}
                                alt={senderName}
                                width={18}
                                height={18}
                                className="w-4.5 h-4.5 rounded-full object-cover shrink-0 bg-white border border-slate-200"
                              />
                              <span className="font-bold text-[11px]">{senderName}</span>
                              {msg.isEdited && !isDeleted && (
                                <span className="text-[10px] opacity-60 italic">(edited)</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] opacity-60">
                                {msg.createdAt
                                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  : ""}
                              </span>
                              {isAdmin && !isDeleted && !isBeingEdited && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEditingReply(selectedContact._id, msg)}
                                    title="Edit reply"
                                    className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-white/15 transition"
                                  >
                                    <Pencil size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteReplyModal({
                                        contactId: selectedContact._id,
                                        messageId: msgId,
                                      })
                                    }
                                    title="Delete reply"
                                    className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-white/15 transition"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Body */}
                          {isBeingEdited ? (
                            <div className="space-y-2 pt-1">
                              <textarea
                                rows={3}
                                value={editingReply.text}
                                onChange={(e) =>
                                  setEditingReply((prev) => ({ ...prev, text: e.target.value }))
                                }
                                placeholder="Edit reply text..."
                                className="w-full bg-white rounded-lg p-2 text-xs border border-slate-300 focus:outline-none text-slate-800 leading-relaxed"
                              />

                              {editingReply.newPreviewUrl ? (
                                <div className="flex items-center gap-2">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={editingReply.newPreviewUrl}
                                    alt="New attachment"
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      URL.revokeObjectURL(editingReply.newPreviewUrl);
                                      setEditingReply((prev) => ({
                                        ...prev,
                                        newImageFile: null,
                                        newPreviewUrl: null,
                                      }));
                                    }}
                                    className="text-[10px] underline opacity-90"
                                  >
                                    Discard new image
                                  </button>
                                </div>
                              ) : editingReply.currentImageUrl && !editingReply.removeImage ? (
                                <div className="flex items-center gap-2">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={editingReply.currentImageUrl}
                                    alt="Current"
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingReply((prev) => ({ ...prev, removeImage: true }))
                                    }
                                    className="text-[10px] underline opacity-90"
                                  >
                                    Remove image
                                  </button>
                                </div>
                              ) : null}

                              <div className="flex items-center justify-between gap-2">
                                <label className="inline-flex items-center gap-1 text-[11px] font-semibold opacity-90 hover:opacity-100 cursor-pointer">
                                  <Plus size={12} />
                                  <span>
                                    {editingReply.currentImageUrl && !editingReply.removeImage
                                      ? "Replace image"
                                      : "Attach image"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      if (editingReply.newPreviewUrl) {
                                        URL.revokeObjectURL(editingReply.newPreviewUrl);
                                      }
                                      setEditingReply((prev) => ({
                                        ...prev,
                                        newImageFile: file,
                                        newPreviewUrl: URL.createObjectURL(file),
                                        removeImage: false,
                                      }));
                                    }}
                                  />
                                </label>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={cancelEditingReply}
                                    className="px-2.5 py-1 rounded-lg text-[11px] hover:bg-white/15"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isUpdatingReply || !editingReply.text.trim()}
                                    onClick={handleSaveEditedReply}
                                    className="px-3 py-1 rounded-lg bg-white text-purple-700 font-semibold text-[11px] disabled:opacity-50"
                                  >
                                    {isUpdatingReply ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : isDeleted ? (
                            <div className="flex items-center gap-1.5 py-0.5 italic text-xs select-none">
                              <AlertTriangle size={12} className="shrink-0" />
                              <span>This message was deleted</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <ExpandableText text={msg.message} isAdmin={isAdmin} />
                              {msg.imageUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={msg.imageUrl}
                                  alt="Attachment"
                                  onClick={() => setImageModal(msg.imageUrl)}
                                  className="max-h-40 rounded-lg object-contain cursor-zoom-in hover:opacity-95 transition"
                                  title="Click to enlarge"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div className="p-3 border-t border-slate-200 bg-white shrink-0">
                  {adminReplyPreview && (
                    <div className="flex items-center gap-2 p-1.5 mb-2 bg-slate-50 rounded-lg border border-slate-200 w-fit">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={adminReplyPreview}
                        alt="Preview"
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <span className="text-[11px] font-medium text-slate-700 truncate max-w-[140px]">
                        {adminReplyImage?.name || "Image attachment"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (adminReplyPreview) URL.revokeObjectURL(adminReplyPreview);
                          setAdminReplyPreview(null);
                          setAdminReplyImage(null);
                        }}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleAdminReply();
                        }
                      }}
                      placeholder={`Reply to ${selectedContact.user?.fullname || "user"}... (Ctrl+Enter to send)`}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 transition resize-none leading-relaxed"
                    />

                    <label
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition"
                      title="Attach image"
                    >
                      <Plus size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAdminReplyImage(file);
                          if (adminReplyPreview) URL.revokeObjectURL(adminReplyPreview);
                          setAdminReplyPreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      disabled={sendingAdminReply || !adminReplyText.trim()}
                      onClick={handleAdminReply}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition disabled:opacity-40"
                    >
                      {sendingAdminReply ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <SendIcon size={14} />
                      )}
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                  <MessageSquareIcon size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Select a conversation</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Pick an inquiry from the list to read the history and reply.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Image Preview Modal ─────────────────────────────────────────── */}
      {imageModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80"
          onClick={() => setImageModal(null)}
        >
          <button
            type="button"
            onClick={() => setImageModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            title="Close"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageModal}
            alt="Attachment preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ── Delete Reply Modal ──────────────────────────────────────────── */}
      {deleteReplyModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50"
          onClick={() => !isDeletingReply && setDeleteReplyModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete Reply?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              This reply will be marked as deleted and its content will no longer be visible to the
              user.
            </p>
            <div className="flex items-center gap-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteReplyModal(null)}
                disabled={isDeletingReply}
                className="px-4 py-2 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReply}
                disabled={isDeletingReply}
                className="inline-flex items-center justify-center gap-2 min-w-[7rem] px-4 py-2 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 transition disabled:opacity-70"
              >
                {isDeletingReply ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Reply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal ──────────────────────────────────────────── */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-center">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">{confirmModal.message}</p>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => setConfirmModal((c) => ({ ...c, isOpen: false }))}
                disabled={confirmActionLoading}
                className="px-4 py-2 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                disabled={confirmActionLoading}
                className={`inline-flex items-center justify-center gap-2 min-w-[7rem] px-4 py-2 rounded-xl font-semibold text-xs text-white transition disabled:opacity-70 ${confirmModal.isDanger
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                {confirmActionLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  confirmModal.confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
