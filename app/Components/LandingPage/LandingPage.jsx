"use client"
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Globe,
  Palette,
  QrCode,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data, status } = useSession();
  const Router = useRouter();
  
  useEffect(() => {
    if (status === "authenticated") {
      Router.push("/Home");
    }
  }, [status, Router]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <main className="flex-1">
        <section className="w-full pt-16 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="space-y-6 text-center lg:text-left lg:w-1/2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                  Showcase{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Your Digital Hub
                  </span>
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[550px] text-slate-300 text-lg md:text-xl leading-relaxed">
                  Combine your professional resume and social connections
                  in one dynamic digital hub. Connect, share, and expand your global reach.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => signIn("google", { redirect: true, callbackUrl: `/Home` })}
                    className="cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
                  >
                    Start for Free
                  </button>
                  <Link 
                    href="#features"
                    className="flex items-center justify-center border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-md active:scale-95"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                  <Image
                    src="/Mark_Linkerfolio/Test.png"
                    alt="LinkerFolio Dashboard"
                    width={700}
                    height={500}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/10">
                    Top Rated 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-slate-800/50 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Why LinkerFolio?
              </h2>
              <p className="text-slate-400 text-lg">Everything you need to boost your professional presence.</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                { icon: Share2, title: "Professional Resume", description: "A stylish design that highlights your experience, skills, and education attractively." },
                { icon: Users, title: "Social Link Management", description: "Consolidate all your social media links in one place for easy access and sharing." },
                { icon: QrCode, title: "Shareable QR Codes", description: "Instant access with downloadable high-resolution QR codes for your profiles." },
                { icon: Globe, title: "Auto Translation", description: "Translate your hub into multiple languages to reach a global professional audience." },
                { icon: Users, title: "Social Networking", description: "Connect with colleagues and peers directly within your professional environment." },
                { icon: Palette, title: "Custom Aesthetics", description: "Personalize your page with curation of premium color palettes and themes." },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <feature.icon size={80} />
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="goal" className="w-full py-24 bg-slate-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl font-black tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                The LinkerFolio Mission
              </h2>
              <p className="text-slate-300 text-xl md:text-2xl leading-relaxed">
                We believe your professional identity should be as dynamic as you are. 
                Streamlining the way you showcase your expertise and connections, 
                LinkerFolio empowers you to build a compelling digital brand that opens doors 
                to global opportunities.
              </p>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full py-24 bg-gradient-to-br from-emerald-600/90 to-cyan-600/90 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to elevate your digital presence?
            </h2>
            <p className="mx-auto max-w-[700px] text-white/90 text-xl mb-10 font-medium leading-relaxed">
              Join thousands of professionals who trust LinkerFolio to showcase their expertise and connect with the world.
            </p>
            <button 
              onClick={() => signIn("google", { redirect: true, callbackUrl: `/Home` })}
              className="bg-white text-emerald-600 text-xl font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-white/10 inline-flex items-center gap-2 active:scale-95"
            >
              Get Started Now <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <footer className="w-full py-12 bg-slate-950 border-t border-slate-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter">LinkerFolio</span>
              </div>
              <p className="text-slate-500 font-medium text-sm">© 2024 LinkerFolio. Premium Digital Branding.</p>
              <nav className="flex gap-10">
                <Link className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors" href="#">Terms</Link>
                <Link className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors" href="#">Privacy</Link>
              </nav>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
