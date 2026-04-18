import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import { MyProvider } from "./Context/MyContext";
import { ToastProvider } from "./Components/toast";
import NextAuthProvider from "./providers/NextAuthProvider";
import {Metadata} from "./data/metadata"
import { Analytics } from "@vercel/analytics/react"

const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = Metadata ;
export const viewport = {
  width: 'device-width',
  initialScale: 0.9,
};

export default function RootLayout({ children }) {
  return (
      <html className="scroll-smooth" lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2614061557764113"
      crossOrigin="anonymous"></script>
      </head>
        <body className={`${prompt.className} min-h-screen scrollbar-none bg-gray-800 g-gradient-to-r from-blue-500 to-purple-500`}>
        <NextAuthProvider>
          <MyProvider>
            <ToastProvider>
                <div className="sticky top-0 z-50 ">
                    <Navbar />
                </div>
                {children}
            </ToastProvider>
        </MyProvider>
        </NextAuthProvider>
        <Analytics />
        </body>
      </html>
  );
}
