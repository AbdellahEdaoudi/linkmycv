"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "../../components/toast";
import { handleApiError } from "../../utils/apiErrorHandler";
import {
  Clock,
  Loader2,
  Send,
  Pencil,
  Trash2,
  X,
  Plus,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "../../components/lucide-react";

function ExpandableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const showToggle = text.length > 200 || text.split("\n").length > 4;

  return (
    <div>
      <p
        className={`text-xs text-slate-800 leading-relaxed whitespace-pre-wrap break-words ${expanded ? "" : "line-clamp-4"
          }`}
      >
        {text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-semibold text-purple-600 mt-1 hover:underline inline-block"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function AttachmentPreview({ url, alt = "Attachment", onOpenLightbox }) {
  if (!url) return null;
  return (
    <div className="mt-2.5 inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        onClick={() => onOpenLightbox && onOpenLightbox(url)}
        className="max-h-40 max-w-full rounded-xl border border-slate-200 object-cover cursor-pointer hover:opacity-95 transition shadow-2xs hover:shadow-xs"
      />
    </div>
  );
}

export default function MySentMessages({
  contacts = [],
  loadingContacts = false,
  currentUser = null,
  router,
  onUpsertContact,
  onDeleteContact,
}) {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";
  // Expand/collapse conversations (set of contact IDs that are open)
  const [openThreads, setOpenThreads] = useState({});

  // Reply state per conversation
  const [replyTexts, setReplyTexts] = useState({});
  const [replyImages, setReplyImages] = useState({});
  const [replyPreviews, setReplyPreviews] = useState({});
  const [sendingReply, setSendingReply] = useState({});

  // Edit state for a single message
  const [editingMsg, setEditingMsg] = useState(null); // { contactId, messageId, text, currentImageUrl, newImageFile, newPreviewUrl, removeImage }
  const [isUpdatingMsg, setIsUpdatingMsg] = useState(false);

  // Message delete confirmation modal
  const [deleteMsgModal, setDeleteMsgModal] = useState(null); // { contactId, messageId }
  const [isDeletingMsg, setIsDeletingMsg] = useState(false);

  // Conversation delete confirmation modal
  const [deleteContactModal, setDeleteContactModal] = useState(null); // contactId
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  // Lightbox modal for attachments
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const toggleThread = (contactId) => {
    setOpenThreads((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  const formatShortDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Reply handlers
  const handleReplyImageChange = (contactId, file) => {
    if (!file) return;
    if (replyPreviews[contactId]) {
      URL.revokeObjectURL(replyPreviews[contactId]);
    }
    setReplyImages((prev) => ({ ...prev, [contactId]: file }));
    setReplyPreviews((prev) => ({
      ...prev,
      [contactId]: URL.createObjectURL(file),
    }));
  };

  const clearReplyImage = (contactId) => {
    if (replyPreviews[contactId]) {
      URL.revokeObjectURL(replyPreviews[contactId]);
    }
    setReplyImages((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });
    setReplyPreviews((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });
  };

  const handleSendReply = async (contactId) => {
    const text = (replyTexts[contactId] || "").trim();
    const imageFile = replyImages[contactId];

    if (!text && !imageFile) {
      toast?.error?.("Please enter a reply message.");
      return;
    }

    setSendingReply((prev) => ({ ...prev, [contactId]: true }));
    try {
      const fd = new FormData();
      if (text) fd.append("message", text);
      if (imageFile) fd.append("image", imageFile);

      const res = await axios.post(
        `${SERVER_URL}/api/contacts/${contactId}/replies`,
        fd,
        { withCredentials: true }
      );

      const updated = res.data?.contact || res.data;
      if (updated && onUpsertContact) {
        onUpsertContact(updated);
      }

      toast?.success?.("Reply sent successfully!");
      setReplyTexts((prev) => ({ ...prev, [contactId]: "" }));
      clearReplyImage(contactId);
    } catch (err) {
      await handleApiError({
        error: err,
        toast,
        router,
        defaultErrorMsg: "Failed to send reply.",
      });
    } finally {
      setSendingReply((prev) => ({ ...prev, [contactId]: false }));
    }
  };

  // Edit Message Handlers
  const startEditingMessage = (contactId, msg) => {
    setEditingMsg({
      contactId,
      messageId: msg._id,
      text: msg.message || "",
      currentImageUrl: msg.imageUrl || null,
      newImageFile: null,
      newPreviewUrl: null,
      removeImage: false,
    });
  };

  const cancelEditingMessage = () => {
    if (editingMsg?.newPreviewUrl) {
      URL.revokeObjectURL(editingMsg.newPreviewUrl);
    }
    setEditingMsg(null);
  };

  const handleSaveEditedMessage = async () => {
    if (!editingMsg) return;
    const text = (editingMsg.text || "").trim();
    if (!text) {
      toast?.error?.("Message text cannot be empty.");
      return;
    }

    setIsUpdatingMsg(true);
    try {
      const fd = new FormData();
      fd.append("message", text);
      if (editingMsg.newImageFile) {
        fd.append("image", editingMsg.newImageFile);
      } else if (editingMsg.removeImage) {
        fd.append("removeImage", "true");
      }

      const res = await axios.put(
        `${SERVER_URL}/api/contacts/${editingMsg.contactId}/replies/${editingMsg.messageId}`,
        fd,
        { withCredentials: true }
      );

      const updated = res.data?.contact || res.data;
      if (updated && onUpsertContact) {
        onUpsertContact(updated);
      }

      toast?.success?.("Message updated successfully!");
      cancelEditingMessage();
    } catch (err) {
      await handleApiError({
        error: err,
        toast,
        router,
        defaultErrorMsg: "Failed to update message.",
      });
    } finally {
      setIsUpdatingMsg(false);
    }
  };

  // Soft-Delete Message (WhatsApp Style)
  const handleDeleteMessage = async () => {
    if (!deleteMsgModal) return;
    const { contactId, messageId } = deleteMsgModal;
    setIsDeletingMsg(true);
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/contacts/${contactId}/replies/${messageId}`,
        { withCredentials: true }
      );

      const updated = res.data?.contact || res.data;
      if (updated && onUpsertContact) {
        onUpsertContact(updated);
      }

      toast?.success?.("Message deleted.");
    } catch (err) {
      await handleApiError({
        error: err,
        toast,
        router,
        defaultErrorMsg: "Failed to delete message.",
      });
    } finally {
      setDeleteMsgModal(null);
      setIsDeletingMsg(false);
    }
  };

  // Delete Entire Contact Conversation
  const handleDeleteWholeContact = async () => {
    if (!deleteContactModal) return;
    setIsDeletingContact(true);
    try {
      await axios.delete(`${SERVER_URL}/api/contacts/${deleteContactModal}`, {
        withCredentials: true,
      });

      if (onDeleteContact) {
        onDeleteContact(deleteContactModal);
      }

      toast?.success?.("Conversation and attachments deleted.");
    } catch (err) {
      await handleApiError({
        error: err,
        toast,
        router,
        defaultErrorMsg: "Failed to delete conversation.",
      });
    } finally {
      setDeleteContactModal(null);
      setIsDeletingContact(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3.5 mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock size={16} className="text-purple-600" />
            <span>My Sent Messages ({contacts.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            View your support conversations, reply to responses, and manage your sent inquiries.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loadingContacts ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
          <Loader2 className="animate-spin text-purple-600 mb-2" size={24} />
          <span>Loading your conversations...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
          <MessageSquare className="mx-auto mb-2 text-slate-300" size={28} />
          <p className="font-semibold text-slate-600">No sent messages yet</p>
          <p className="mt-0.5 text-slate-400">
            Send your first inquiry using the form above to start a conversation with support.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => {
            const contactId = contact._id || contact.id;
            const isOpen = openThreads[contactId] !== false; // default open
            const messagesList = Array.isArray(contact.messages) && contact.messages.length > 0
              ? contact.messages
              : [
                {
                  _id: "init",
                  sender: contact.user,
                  senderRole: "user",
                  message: contact.message || "No content",
                  imageUrl: contact.imageUrl,
                  createdAt: contact.createdAt,
                },
              ];

            const lastMessage = messagesList[messagesList.length - 1];
            const hasAdminReply = messagesList.some((m) => m.senderRole === "admin");
            const isAwaitingAdmin = lastMessage?.senderRole === "user";

            return (
              <div
                key={contactId}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden transition duration-150"
              >
                {/* Contact Card Header */}
                <div className="p-4 sm:p-5 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight break-words">
                        {contact.subject || "No Subject"}
                      </h4>
                      {hasAdminReply ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          <ShieldCheck size={11} />
                          Support Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Response
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span>Started: {formatShortDate(contact.createdAt)}</span>
                      <span>•</span>
                      <span>
                        {messagesList.length} message{messagesList.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  {/* Actions for the whole conversation */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Thread button with rotating icon */}
                    <button
                      type="button"
                      onClick={() => toggleThread(contactId)}
                      title={isOpen ? "Collapse conversation" : "Expand conversation"}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-200 text-slate-500 hover:text-purple-600 transition"
                    >
                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteContactModal(contactId)}
                      title="Delete entire conversation"
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Thread Body */}
                {isOpen && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Messages Flow */}
                    <div className="space-y-3.5">
                      {messagesList.map((msg, index) => {
                        const msgId = msg._id || `msg-${index}`;
                        const isAdmin = msg.senderRole === "admin";
                        const isDeleted = Boolean(msg.isDeleted);
                        const isBeingEdited =
                          editingMsg?.contactId === contactId &&
                          editingMsg?.messageId === msgId;

                        const senderUser = msg.sender && typeof msg.sender === "object" ? msg.sender : null;
                        const senderAvatar = isAdmin ? "/logo.png" : (senderUser?.profileImage || senderUser?.urlimage || "/avatar.png");
                        const senderName = isAdmin
                          ? "LinkMyCV Support"
                          : senderUser?.fullname || currentUser?.fullname || "You";

                        return (
                          <div
                            key={msgId}
                            className={`rounded-2xl p-4 border transition ${isAdmin
                              ? "bg-purple-50/60 border-purple-100"
                              : isDeleted
                                ? "bg-slate-100/70 border-slate-200 border-dashed"
                                : "bg-white border-slate-200/90"
                              }`}
                          >
                            {/* Message Header */}
                            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100/80">
                              <div className="flex items-center gap-2 min-w-0">
                                <Image
                                  src={senderAvatar}
                                  alt={senderName}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900">
                                    {isAdmin ? "LinkMyCV Support" : senderName}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${isAdmin
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-slate-100 text-slate-600"
                                      }`}
                                  >
                                    {isAdmin ? "Admin" : "You"}
                                  </span>
                                  {msg.isEdited && !isDeleted && (
                                    <span className="text-[10px] text-slate-400 italic">
                                      (edited)
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-400">
                                  {formatShortDate(msg.createdAt)}
                                </span>

                                {/* User Action Buttons: only allowed for own active messages */}
                                {!isAdmin && !isDeleted && !isBeingEdited && (
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      type="button"
                                      onClick={() => startEditingMessage(contactId, msg)}
                                      title="Edit message"
                                      className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                                    >
                                      <Pencil size={12} />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setDeleteMsgModal({ contactId, messageId: msgId })}
                                      title="Delete conversation"
                                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Message Content: Normal vs Deleted vs Editing */}
                            {isBeingEdited ? (
                              /* Inline Editing Mode */
                              <div className="space-y-3 pt-1">
                                <textarea
                                  rows={3}
                                  maxLength={5000}
                                  value={editingMsg.text}
                                  onChange={(e) =>
                                    setEditingMsg((prev) => ({
                                      ...prev,
                                      text: e.target.value,
                                    }))
                                  }
                                  placeholder="Edit your message..."
                                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition leading-relaxed"
                                />

                                {/* Image Preview & Actions in Edit Mode */}
                                <div className="space-y-2">
                                  {editingMsg.newPreviewUrl ? (
                                    <div className="flex items-center gap-2">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={editingMsg.newPreviewUrl}
                                        alt="New attachment"
                                        className="h-14 w-14 rounded-lg object-cover border border-purple-200"
                                      />
                                      <div>
                                        <span className="text-[11px] font-semibold text-purple-700 block">
                                          New image to upload
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            URL.revokeObjectURL(editingMsg.newPreviewUrl);
                                            setEditingMsg((prev) => ({
                                              ...prev,
                                              newImageFile: null,
                                              newPreviewUrl: null,
                                            }));
                                          }}
                                          className="text-[10px] text-rose-600 hover:underline"
                                        >
                                          Discard new image
                                        </button>
                                      </div>
                                    </div>
                                  ) : editingMsg.currentImageUrl && !editingMsg.removeImage ? (
                                    <div className="flex items-center gap-3">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={editingMsg.currentImageUrl}
                                        alt="Current attachment"
                                        className="h-14 w-14 rounded-lg object-cover border border-slate-200"
                                      />
                                      <div>
                                        <span className="text-[11px] text-slate-500 block">
                                          Current attachment
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingMsg((prev) => ({
                                              ...prev,
                                              removeImage: true,
                                            }))
                                          }
                                          className="text-[11px] font-semibold text-rose-600 hover:underline inline-flex items-center gap-1"
                                        >
                                          <Trash2 size={12} />
                                          Remove image
                                        </button>
                                      </div>
                                    </div>
                                  ) : editingMsg.removeImage ? (
                                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                                      <span>Image will be permanently removed from Cloudinary.</span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditingMsg((prev) => ({
                                            ...prev,
                                            removeImage: false,
                                          }))
                                        }
                                        className="font-bold underline ml-2"
                                      >
                                        Keep image
                                      </button>
                                    </div>
                                  ) : null}

                                  {/* Button to attach / replace image */}
                                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer pt-1">
                                    <Plus size={13} />
                                    <span>
                                      {editingMsg.currentImageUrl && !editingMsg.removeImage
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
                                        if (editingMsg.newPreviewUrl) {
                                          URL.revokeObjectURL(editingMsg.newPreviewUrl);
                                        }
                                        setEditingMsg((prev) => ({
                                          ...prev,
                                          newImageFile: file,
                                          newPreviewUrl: URL.createObjectURL(file),
                                          removeImage: false,
                                        }));
                                      }}
                                    />
                                  </label>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={cancelEditingMessage}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isUpdatingMsg || !editingMsg.text.trim()}
                                    onClick={handleSaveEditedMessage}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition disabled:opacity-50"
                                  >
                                    {isUpdatingMsg && <Loader2 size={12} className="animate-spin" />}
                                    <span>{isUpdatingMsg ? "Saving..." : "Save Changes"}</span>
                                  </button>
                                </div>
                              </div>
                            ) : isDeleted ? (
                              /* WhatsApp Style Deleted Message State */
                              <div className="flex items-center gap-2 py-1 text-slate-400 italic text-xs select-none">
                                <AlertTriangle size={14} className="text-slate-400 shrink-0" />
                                <span>This message was deleted</span>
                                {msg.deletedAt && (
                                  <span className="text-[10px] text-slate-300 not-italic">
                                    ({formatShortDate(msg.deletedAt)})
                                  </span>
                                )}
                              </div>
                            ) : (
                              /* Normal Message View */
                              <div>
                                <ExpandableText text={msg.message} />
                                <AttachmentPreview
                                  url={msg.imageUrl}
                                  onOpenLightbox={setLightboxUrl}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Reply Form to this Thread - Only available after admin has replied */}
                    {hasAdminReply ? (
                      <div className="pt-3 border-t border-slate-200">
                        <div className="space-y-2.5">
                          <div className="relative">
                            <textarea
                              rows={2}
                              maxLength={5000}
                              value={replyTexts[contactId] || ""}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({
                                  ...prev,
                                  [contactId]: e.target.value,
                                }))
                              }
                              placeholder="Write a reply or follow-up to this conversation..."
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition leading-relaxed"
                            />
                          </div>

                          {/* Reply image attachment control & preview */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer">
                                <Plus size={13} />
                                <span>Attach image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    handleReplyImageChange(contactId, file);
                                  }}
                                />
                              </label>

                              {replyPreviews[contactId] && (
                                <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={replyPreviews[contactId]}
                                    alt="Preview"
                                    className="h-7 w-7 rounded object-cover"
                                  />
                                  <span className="text-[10px] text-purple-700 font-semibold truncate max-w-[120px]">
                                    {replyImages[contactId]?.name || "Image"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => clearReplyImage(contactId)}
                                    className="text-slate-400 hover:text-slate-700"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={
                                sendingReply[contactId] ||
                                (!replyTexts[contactId]?.trim() && !replyImages[contactId])
                              }
                              onClick={() => handleSendReply(contactId)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition duration-200 disabled:opacity-50"
                            >
                              {sendingReply[contactId] ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Send size={12} />
                                  <span>Send Reply</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-200">
                        <div className="flex items-start sm:items-center gap-2.5 p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs">
                          <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-amber-900">
                              Awaiting response from linkmycv support
                            </p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              Your message has been received. You will be able to send follow-up replies here once our support team replies. You can edit your message above if needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete Conversation Confirmation Modal ─────────────────────── */}
      {deleteMsgModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => !isDeletingMsg && setDeleteMsgModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete Conversation?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              This message will be marked as deleted and its content will no longer be visible. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteMsgModal(null)}
                disabled={isDeletingMsg}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMessage}
                disabled={isDeletingMsg}
                className="inline-flex items-center justify-center gap-2 min-w-[7rem] px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 transition disabled:opacity-70"
              >
                {isDeletingMsg ? (
                  <><Loader2 size={13} className="animate-spin" /><span>Deleting...</span></>
                ) : (
                  "Delete Conversation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Conversation Confirmation Modal ─────────────────────── */}
      {deleteContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => !isDeletingContact && setDeleteContactModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete Conversation?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              This will permanently delete the entire conversation and all its attachments from the server. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteContactModal(null)}
                disabled={isDeletingContact}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteWholeContact}
                disabled={isDeletingContact}
                className="inline-flex items-center justify-center gap-2 min-w-[7rem] px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 transition disabled:opacity-70"
              >
                {isDeletingContact ? (
                  <><Loader2 size={13} className="animate-spin" /><span>Deleting...</span></>
                ) : (
                  "Delete Conversation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full Image View */}
      {lightboxUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white/10 rounded-2xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="Full attachment"
              className="max-h-[85vh] max-w-full rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
