"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import { MyContext } from "../context/MyContext";
import {
  QrCode,
  X,
  Download,
  Share2,
  Link as LinkIcon,
  CheckCheck,
} from "../components/lucide-react";
import { toast } from "../components/toast";

export default function QrcodeProfile({ userData, path, btnClassName }) {
  const user = userData || {};
  const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "";
  const qrCodeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const displayName = user?.fullname || "Your profile";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const getFullUrl = () =>
    `${CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "")}${path}`;

  // Close on Escape + lock page scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const getCanvas = () => qrCodeRef.current?.querySelector("canvas");

  const downloadQRCode = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${user?.username || "profile"}-linkmycv-QR.png`;
    link.click();
    toast?.success?.("QR code downloaded");
  };

  const copyLink = async () => {
    const url = getFullUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast?.success?.("Profile link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast?.error?.("Couldn't copy the link. Copy it manually from the field.");
    }
  };

  const shareQRCode = () => {
    const canvas = getCanvas();
    const url = getFullUrl();
    const shareText = `Check out ${user?.fullname || "my"}'s CV and portfolio on linkmycv`;

    if (!navigator.share) return downloadQRCode();

    if (canvas) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], `${user?.username || "profile"}-linkmycv.png`, {
          type: "image/png",
        });
        const payload = { files: [file], title: displayName, text: shareText };
        if (navigator.canShare?.(payload)) {
          navigator.share(payload).catch(() => {});
        } else {
          navigator.share({ title: displayName, text: shareText, url }).catch(() => {});
        }
      });
    }
  };

  const qrProps = {
    value: getFullUrl(),
    bgColor: "#ffffff",
    fgColor: "#1b1536",
    includeMargin: false,
    level: "H",
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        title="View QR code"
        aria-label="View QR code"
        className={
          btnClassName ||
          "rounded-full hover:scale-110 flex items-center justify-center hover:bg-violet-50 border border-gray-200 h-9 w-9 transition duration-300 bg-white shadow-sm text-gray-600 hover:text-violet-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        }
      >
        <QrCode size={14} />
      </button>

      {isOpen && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Profile QR code"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#120d28]/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-[380px] bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hidden high-res canvas used for download / share */}
            <div className="hidden" ref={qrCodeRef}>
              <QRCodeCanvas
                {...qrProps}
                size={900}
                marginSize={4}
                imageSettings={{
                  src: "/mycvlink-logo.png",
                  height: 130,
                  width: 130,
                  excavate: true,
                }}
              />
            </div>

            {/* Identity header */}
            <div className="relative bg-[#1b1536] px-6 pt-6 pb-24 text-white">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 pr-10">
                <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-violet-500">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={displayName}
                      className="block w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-bold tracking-wide text-white">
                      {initials || <QrCode size={18} />}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base leading-tight truncate">
                    {displayName}
                  </h3>
                  {user?.username && (
                    <p className="text-sm text-white/55 truncate">@{user.username}</p>
                  )}
                </div>
              </div>
            </div>

            {/* QR plate overlapping the header */}
            <div className="relative -mt-[72px] px-6">
              <div className="mx-auto w-fit rounded-3xl bg-white p-4 shadow-[0_12px_40px_-12px_rgba(27,21,54,0.45)] ring-1 ring-black/5">
                <QRCodeCanvas
                  {...qrProps}
                  size={200}
                  marginSize={1}
                  className="block rounded-lg"
                  imageSettings={{
                    src: "/mycvlink-logo.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Scan with a phone camera to open this CV.
              </p>
            </div>

            {/* Link + actions */}
            <div className="px-6 pt-5 pb-6 space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-[#f5f3fb] pl-3 pr-1.5 py-1.5">
                <LinkIcon size={14} className="shrink-0 text-gray-400" />
                <input
                  readOnly
                  value={getFullUrl()}
                  onFocus={(e) => e.target.select()}
                  aria-label="Profile link"
                  className="min-w-0 flex-1 bg-transparent text-xs text-gray-700 font-mono truncate focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    copied
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-white text-gray-800 hover:bg-violet-50 shadow-sm"
                  }`}
                >
                  {copied ? <CheckCheck size={14} /> : null}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center gap-2 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  <Download size={16} />
                  Download PNG
                </button>
                <button
                  onClick={shareQRCode}
                  className="flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 