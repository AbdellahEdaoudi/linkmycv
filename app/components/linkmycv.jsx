import React, { useContext, useState } from "react";
import { Cairo } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Copy,
  CheckCheck,
  Mail,
  MapPin,
  Phone,
  X,
  Briefcase,
  Sparkles,
  GraduationCap,
  Languages,
  UserCheck,
  Building2,
  ExternalLink,
  Globe,
  Download,
  Loader2,
} from "./lucide-react";
import { toast } from "./toast";
import { MyContext } from "../context/MyContext";
import QrcodeProfile from "../[username]/QrcodeProfile";
import { SUPPORTED_LANGUAGES, getUiTexts } from "../utils/translation";
import { downloadCvPdf } from "./downloadcv/pdfService";

const cairo = Cairo({ subsets: ['latin', 'arabic'], weight: ['400', '600', '700', '800'], display: 'swap' });

export default function LinkMyCV({ userData, path: propPath, currentLang = "en" }) {
  const currentPath = usePathname();
  const path = propPath || currentPath;
  const router = useRouter();
  const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "";

  const [copied, setCopied] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf || !userData) return;
    try {
      setIsDownloadingPdf(true);
      toast?.info?.(ui.downloading || "Generating PDF...");
      await downloadCvPdf(userData, currentLang);
      toast?.success?.(ui.downloadSuccess || "CV downloaded successfully!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast?.error?.("Failed to generate PDF");
    } finally {
      setIsDownloadingPdf(false);
    }
  };



  // Active language and UI translations dictionary
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const ui = getUiTexts(currentLang);

  const handleLanguageChange = (langCode) => {
    setIsLangMenuOpen(false);
    if (!userData?.username) return;

    const baseUsername = userData.username.toLowerCase();
    if (langCode === "en") {
      router.push(`/${baseUsername}`);
    } else {
      router.push(`/${baseUsername}/${langCode}`);
    }
  };

  const getFullUrl = () => {
    return `${CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "")}${path}`;
  };

  const copyProfileLink = () => {
    const fullUrl = getFullUrl();
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setCopied(true);
        toast?.success?.(ui.profileCopied || "Profile link copied!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast?.error?.(ui.failedToCopy || "Failed to copy link");
      });
  };




  const formatDate = (d, yearOnly = false) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const locale = currentLang === "ar" ? "ar-EG" : currentLang || "en-US";
    return yearOnly
      ? date.toLocaleDateString(locale, { year: "numeric" })
      : date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  };

  const socialChannels = [
    {
      id: "linkedin",
      icon: "/Icons/link.svg",
      label: "LinkedIn",
      link: userData?.socials?.linkedin || userData?.Linkedin || userData?.linkedin,
    },
    {
      id: "github",
      icon: "/Icons/github.svg",
      label: "GitHub",
      link: userData?.socials?.github || userData?.github,
    },
  ].filter((item) => Boolean(item.link));

  const skills = (userData?.skillsList || [])
    .map((s) => (typeof s === "object" ? s?.name || s?.skill || "" : s))
    .map((s) => String(s).trim())
    .filter(Boolean)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  return (
    <div className="min-h-screen bg-slate-100/80 py-2 sm:py-6 px-2 sm:px-4 flex justify-center text-slate-800 antialiased relative">


      {/* ── Interactive Web CV Sheet Container ── */}
      <div
        dir={activeLangObj?.dir || "ltr"}
        className={`${cairo.className} relative w-full max-w-3xl bg-white shadow-md border border-slate-200/90 rounded-xl p-3.5 sm:p-7 text-slate-800 print:hidden`}
      >

        {/* ── Compact Executive Header ── */}
        <header className="pb-3 border-b border-slate-200">

          {/* ROW 1: Avatar + Name/@username + Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Avatar */}
              <div
                onClick={() => setOpenImageModal(true)}
                className="cursor-pointer group relative shrink-0"
                title={ui.clickToViewImage || "Click to view image"}
              >
                <Image
                  width={72}
                  height={72}
                  src={userData?.profileImage || "/avatar.png"}
                  alt={userData?.fullname || "Profile"}
                  className="w-14 h-14 sm:w-[72px] sm:h-[72px] aspect-square object-cover border-2 border-purple-500 shadow-sm rounded-full group-hover:scale-105 transition duration-200"
                />
              </div>

              {/* Name + @username + desktop info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-tight">
                    {userData?.fullname}
                  </h1>
                  {userData?.username && (
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 leading-none shrink-0">
                      @{userData.username}
                    </span>
                  )}
                </div>

                {/* Desktop only: Specialization + Contact + Socials */}
                <div className="hidden sm:block mt-1 space-y-1">
                  {userData?.specialization && (
                    <p className="text-[13px] font-semibold text-purple-700 leading-snug">
                      {userData.specialization}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                    {userData?.country && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-rose-500 shrink-0" />
                        {userData.country}
                      </span>
                    )}
                    {userData?.phoneNumber && (
                      <a href={`tel:${userData.phoneNumber}`} className="flex items-center gap-1 hover:text-purple-600 transition">
                        <Phone size={10} className="text-purple-500 shrink-0" />
                        <span style={{ unicodeBidi: 'embed', direction: 'ltr' }}>
                          {userData.phoneNumber}
                        </span>
                      </a>
                    )}
                    {userData?.email && (
                      <a href={`mailto:${userData.email}`} className="flex items-center gap-1 hover:text-purple-600 transition">
                        <Mail size={10} className="text-purple-500 shrink-0" />
                        <span className="truncate max-w-none">{userData.email}</span>
                      </a>
                    )}
                  </div>
                  {socialChannels.length > 0 && (
                    <div className="flex items-center gap-2">
                      {socialChannels.map((s) => (
                        <a
                          key={s.id}
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 px-2 py-0.5 rounded border border-slate-200 hover:border-purple-200 transition"
                        >
                          <Image src={s.icon} alt={s.label} width={12} height={12} className="shrink-0" />
                          <span>{s.label}</span>
                          <ExternalLink size={9} className="text-slate-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons — Row 1: 3 icons (Copy, QR, Email) | Row 2: (PDF, Language) */}
            <div className="flex flex-col items-end gap-1 sm:gap-5 shrink-0">

              {/* Row 1: Copy, QR, Email */}
              <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                {/* Copy */}
                <button
                  onClick={copyProfileLink}
                  title={copied ? (ui.copied || "Copied!") : (ui.copyLink || "Copy Link")}
                  className={`rounded-full flex items-center justify-center border h-7 w-7 sm:h-8 sm:w-8 transition ${copied
                    ? "bg-emerald-50 text-emerald-600 border-emerald-300 ring-1 ring-emerald-200"
                    : "bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200"
                    }`}
                >
                  {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>

                {/* QR */}
                <QrcodeProfile
                  userData={userData}
                  path={path}
                  btnClassName="rounded-full flex items-center justify-center border h-7 w-7 sm:h-8 sm:w-8 transition bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200"
                />

                {/* Email */}
                {userData?.email && (
                  <a
                    href={`mailto:${userData.email}`}
                    title={ui.sendEmail || "Send Email"}
                    className="rounded-full flex items-center justify-center border h-7 w-7 sm:h-8 sm:w-8 transition bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200"
                  >
                    <Mail size={13} />
                  </a>
                )}
              </div>

              {/* Row 2: PDF Button + Language Selector (Underneath the 3 buttons) */}
              <div className="flex items-center justify-end gap-1 sm:gap-1.5 w-full">
                {/* Download PDF button — one-click direct download */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  title={ui.downloadPdf || "Download PDF"}
                  className="flex-1 sm:flex-initial rounded-full flex items-center justify-center gap-1 border h-7 sm:h-8 px-2 sm:px-2.5 transition text-xs font-semibold shrink-0 bg-purple-600 hover:bg-purple-700 disabled:opacity-75 disabled:cursor-wait text-white border-purple-600 shadow-xs cursor-pointer"
                >
                  {isDownloadingPdf ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  <span className="text-[10px] sm:text-[11px] font-bold">PDF</span>
                </button>

                {/* Language selector */}
                <div className="relative flex-1 sm:flex-initial">
                  <button
                    type="button"
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    title="Change Language"
                    className="w-full sm:w-auto rounded-full flex items-center justify-center gap-1 sm:gap-1.5 border h-7 sm:h-8 px-2 sm:px-2.5 transition bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-600 border-slate-200 text-xs font-semibold"
                  >
                    <span className={`${activeLangObj.flagClass} rounded-[2px] overflow-hidden`} />
                    <span className="uppercase text-[10px] sm:text-[11px] font-bold">{activeLangObj.code}</span>
                  </button>

                  {isLangMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 min-w-[150px] max-h-72 overflow-y-auto">
                        <p className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                          {ui.translateCv || "Translate CV"}
                        </p>
                        {SUPPORTED_LANGUAGES.map((langItem) => {
                          const isSelected = activeLangObj.code === langItem.code;
                          return (
                            <button
                              key={langItem.code}
                              type="button"
                              onClick={() => handleLanguageChange(langItem.code)}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${isSelected ? "bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`${langItem.flagClass} rounded-[2px] overflow-hidden`} />
                                <span>{langItem.label}</span>
                              </div>
                              {isSelected && <CheckCheck size={12} className="text-purple-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Mobile only: Specialization, Contact, Socials — full width below */}
          <div className="sm:hidden mt-1.5 space-y-1">
            {/* Specialization */}
            {userData?.specialization && (
              <p className="text-xs sm:text-[13px] font-semibold text-purple-700 leading-snug">
                {userData.specialization}
              </p>
            )}

            {/* Contact: location · phone · email in one line, wraps if needed */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] sm:text-[11px] text-slate-500">
              {userData?.country && (
                <span className="flex items-center gap-1">
                  <MapPin size={10} className="text-rose-500 shrink-0" />
                  {userData.country}
                </span>
              )}
              {userData?.phoneNumber && (
                <a href={`tel:${userData.phoneNumber}`} className="flex items-center gap-1 hover:text-purple-600 transition">
                  <Phone size={10} className="text-purple-500 shrink-0" />
                  <span style={{ unicodeBidi: 'embed', direction: 'ltr' }}>
                    {userData.phoneNumber}
                  </span>
                </a>
              )}
              {userData?.email && (
                <a href={`mailto:${userData.email}`} className="flex items-center gap-1 hover:text-purple-600 transition">
                  <Mail size={10} className="text-purple-500 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{userData.email}</span>
                </a>
              )}
            </div>

            {/* Social links: GitHub + LinkedIn in one line */}
            {socialChannels.length > 0 && (
              <div className="flex items-center gap-2">
                {socialChannels.map((s) => (
                  <a
                    key={s.id}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium text-slate-600 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 px-2 py-0.5 rounded border border-slate-200 hover:border-purple-200 transition"
                  >
                    <Image src={s.icon} alt={s.label} width={12} height={12} className="shrink-0" />
                    <span>{s.label}</span>
                    <ExternalLink size={9} className="text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

        </header>



        {/* ── Avatar Modal ── */}
        {openImageModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
            onClick={() => setOpenImageModal(false)}
          >
            <div
              className="bg-white p-3 rounded-2xl relative shadow-2xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenImageModal(false)}
                className="absolute -top-3 -right-3 bg-white p-1.5 rounded-full text-slate-600 hover:text-black shadow-lg"
              >
                <X size={16} />
              </button>
              <Image
                width={360}
                height={360}
                src={userData?.profileImage || "/avatar.png"}
                alt={userData?.fullname || "Profile"}
                className="object-cover rounded-xl w-full max-h-[75vh]"
              />
            </div>
          </div>
        )}

        {/* ── SECTION 1: Professional Summary ── */}
        {userData?.summary && (
          <section className="mt-3">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5 flex items-center gap-1.5">
              <UserCheck size={14} className="text-purple-600" />
              <span>{ui.professionalSummary || "Professional Summary"}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
              {userData.summary}
            </p>
          </section>
        )}

        {/* ── SECTION 2: Work Experience ── */}
        {userData?.experiences && userData.experiences.length > 0 && (
          <section className="mt-3.5">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <Briefcase size={14} className="text-emerald-600" />
              <span>{ui.workExperience || "Work Experience"}</span>
            </h2>
            <div className="space-y-2.5">
              {userData.experiences.map((exp, idx) => {
                const startStr = formatDate(exp.startDate);
                const endStr = exp.current ? (ui.present || "Present") : formatDate(exp.endDate);
                const dateDisplay = startStr ? `${startStr} — ${endStr || ui.present || "Present"}` : "";

                return (
                  <div key={idx} className="text-xs">
                    {/* Position & Company & Date Row */}
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-[13px] text-slate-900">
                          {exp.position}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-xs text-slate-800">
                          {exp.company}
                        </span>
                        {exp.location && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-500 italic">
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>

                      {dateDisplay && (
                        <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          <span>{dateDisplay}</span>
                        </div>
                      )}
                    </div>

                    {/* Description / Bullets */}
                    {exp.description && (
                      <p className="mt-1 text-[10.5px] sm:text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-slate-200">
                        {exp.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SECTION 3: Skills ── */}
        {skills.length > 0 && (
          <section className="mt-3.5">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>{ui.skills || ui.technicalSkills || "Skills"}</span>
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] sm:text-xs font-medium text-slate-700"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── SECTION 4: Education ── */}
        {userData?.educations && userData.educations.length > 0 && (
          <section className="mt-3.5">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <GraduationCap size={14} className="text-indigo-600" />
              <span>{ui.education || "Education"}</span>
            </h2>
            <div className="space-y-2">
              {userData.educations.map((edu, idx) => {
                const startStr = formatDate(edu.startDate, true);
                const endStr = edu.current ? (ui.present || "Present") : formatDate(edu.endDate, true);
                const dateDisplay = startStr ? `${startStr} — ${endStr || ui.present || "Present"}` : "";

                return (
                  <div key={idx} className="text-xs">
                    {/* Row 1: Degree + Specialization (Left) & Date (Right) */}
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs sm:text-[13px] text-slate-900">
                          {edu.degree}
                        </span>
                        {edu.fieldOfStudy && (
                          <span className="text-slate-700 font-medium">
                            {" "}· {edu.fieldOfStudy}
                          </span>
                        )}
                      </div>

                      {dateDisplay && (
                        <span className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap shrink-0">
                          {dateDisplay}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Institution + Location underneath specialization */}
                    {(edu.institution || edu.location) && (
                      <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span>{edu.institution}</span>
                        {edu.location && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500 italic">{edu.location}</span>
                          </>
                        )}
                      </div>
                    )}

                    {edu.description && (
                      <p className="mt-0.5 text-[10.5px] sm:text-xs text-slate-600 leading-snug">
                        {edu.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SECTION 5: Languages ── */}
        {userData?.languagesList && userData.languagesList.length > 0 && (
          <section className="mt-3.5">
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5 flex items-center gap-1.5">
              <Languages size={14} className="text-teal-600" />
              <span>{ui.languages || "Languages"}</span>
            </h2>
            <p className="text-[11.5px] sm:text-xs text-slate-700 leading-relaxed">
              {userData.languagesList
                .map((lang) => {
                  if (typeof lang === "object") {
                    const name = lang.language || lang.name || "";
                    const level = lang.level || lang.proficiency || "";
                    return level ? `${name} (${level})` : name;
                  }
                  return String(lang);
                })
                .filter(Boolean)
                .join("  ·  ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
