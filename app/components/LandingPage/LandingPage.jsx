"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  Link as LinkIcon,
  QrCode,
  Share2,
  Download,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "../lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");

  const handleClaim = (e) => {
    e.preventDefault();
    const clean = usernameInput.toLowerCase().trim().replace(/[^a-z0-9._-]/g, "");
    if (clean) {
      router.push(`/auth/register?username=${encodeURIComponent(clean)}`);
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 text-slate-900">
      <main className="flex-1">
        {/* Hero */}
        <section className="py-8 lg:py-4 lg:min-h-[calc(100vh-6.5rem)] lg:flex lg:items-center border-b border-purple-200 bg-gradient-to-br from-purple-100 via-purple-50 to-sky-100">
          <div className="container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="space-y-5 text-center lg:text-left lg:w-1/2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Your CV in a Single, <br />
                  <span className="text-purple-600">Shareable Link.</span>
                </h1>

                <p className="max-w-xl mx-auto lg:mx-0 text-slate-600 text-base leading-relaxed">
                  Create, manage, and share your professional digital CV with a single link and instant QR code. Keep your career up-to-date and impress employers anywhere.
                </p>

                <form
                  onSubmit={handleClaim}
                  className="max-w-md mx-auto lg:mx-0 bg-white p-2 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="flex items-center gap-1.5 pl-2.5 w-full sm:w-auto flex-1 font-mono text-xs sm:text-sm text-slate-500">
                    <span className="text-purple-600 font-bold select-none">
                      linkmycv.site/
                    </span>
                    <input
                      type="text"
                      placeholder="yourname"
                      value={usernameInput}
                      onChange={(e) =>
                        setUsernameInput(
                          e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "")
                        )
                      }
                      className="bg-transparent text-slate-900 font-medium focus:outline-none w-full placeholder-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm transition duration-150 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </button>
                </form>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Free personal link</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Instant QR code</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>PDF download ready</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full max-w-lg">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      Live CV Preview
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200 shadow-xs shrink-0">
                          <Image
                            src="/doctor-demo.jpg"
                            alt="Dr. Omar Tazi"
                            fill
                            sizes="56px"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              Dr. Omar Tazi
                            </h3>
                            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              @omar
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-purple-700">
                            General Practitioner & Internal Medicine
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={10} className="text-rose-500" />
                              Morocco
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail size={10} className="text-purple-500" />
                              omar@example.com
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 select-none">
                        <div
                          className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Download size={11} />
                          <span>PDF</span>
                        </div>
                        <div
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          <QrCode size={13} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                        <UserCheck size={12} className="text-purple-600" />
                        <span>Professional Summary</span>
                      </h4>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11.5px]">
                        Dedicated physician with 6+ years of clinical experience in general practice and internal medicine. Committed to accurate diagnosis, compassionate patient care, and evidence-based treatment.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                        <Briefcase size={12} className="text-emerald-600" />
                        <span>Work Experience</span>
                      </h4>
                      <div className="space-y-2 border-l-2 border-purple-200 pl-3">
                        <div>
                          <div className="flex items-center justify-between text-slate-900 font-semibold text-xs">
                            <span>General Practitioner &bull; City Medical Center</span>
                            <span className="text-[10px] text-slate-500 font-normal">2021 — 2024</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            Diagnosed and treated patients, managed chronic conditions, and coordinated referrals to specialists.
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-slate-900 font-semibold text-xs">
                            <span>Resident Physician &bull; Al Amal University Hospital</span>
                            <span className="text-[10px] text-slate-500 font-normal">2018 — 2021</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            Worked across internal medicine and emergency wards, performing rounds and patient follow-up.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-500" />
                        <span>Skills & Capabilities</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Patient Care",
                          "Clinical Diagnosis",
                          "Emergency Medicine",
                          "Medical Records",
                          "Team Collaboration",
                        ].map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>This is what your visitors will see</span>
                    <button
                      onClick={() => router.push("/auth/register")}
                      className="text-purple-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Create your own link</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-purple-50 border-b border-purple-200">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How It Works
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Get your online CV up and running in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-purple-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Choose Your Username
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Register your account and pick your unique personal link:{" "}
                  <code className="text-purple-600 font-semibold">linkmycv.site/yourname</code>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-purple-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Fill In Your Information
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Add your job history, education, skills, photo, and social links in your dashboard.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-purple-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Share Your Link Everywhere
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Share your link on LinkedIn, in emails, or download the QR code for your business card.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-14 bg-sky-50 border-b border-sky-200">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Why Use linkmycv?
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Everything you need to share your professional resume easily
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: LinkIcon,
                  title: "One Clean Link",
                  desc: "A short, memorable link to send via WhatsApp, LinkedIn, or email.",
                },
                {
                  icon: QrCode,
                  title: "QR Code Included",
                  desc: "Instantly scan to open your CV on any phone or tablet.",
                },
                {
                  icon: Download,
                  title: "PDF Export",
                  desc: "Download a clean PDF version whenever an employer asks for a file.",
                },
                {
                  icon: Globe,
                  title: "Always Up-to-Date",
                  desc: "Edit your CV anytime; anyone with your link sees the latest updates.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white border border-sky-200 text-left space-y-2"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-purple-700 text-white text-center">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Ready to create your CV link?
            </h2>
            <p className="text-purple-100 text-sm mb-6 max-w-md mx-auto">
              Join professionals who share their resume with linkmycv. It only takes a minute to set up.
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="px-7 py-3 rounded-lg bg-white hover:bg-purple-50 text-purple-700 font-semibold text-sm transition duration-150 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-purple-100 border-t border-purple-200 text-xs text-slate-600">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  link<span className="text-purple-600">mycv</span>
                </span>
                <span className="text-slate-300">|</span>
                <span>Your CV in a Single Link</span>
              </div>

              <div className="flex items-center gap-5">
                <Link href="/contact" className="hover:text-purple-600 transition">
                  Contact
                </Link>
                <Link href="/auth/login" className="hover:text-purple-600 transition">
                  Login
                </Link>
                <Link href="/auth/register" className="hover:text-purple-800 transition font-semibold text-purple-600">
                  Register
                </Link>
              </div>

              <p>&copy; 2024 linkmycv. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
