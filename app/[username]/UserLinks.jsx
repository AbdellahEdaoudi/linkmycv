"use client";
import React, { useState } from "react";
import { Link as LinkIcon, X } from "lucide-react";

function UserLinks({ userLinks = [], language, labels }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <p 
        onClick={() => setIsOpen(true)}
        className="text-blue-900 mt-1 hover:cursor-pointer flex items-center justify-center sm:justify-start md:justify-start gap-2"
      >
        <LinkIcon width={18} />
        {labels?.businessLinks || "Business Links"}
      </p>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 border-b pb-4">
                {labels?.businessLinks || "Business Links"}
              </h1>

              <div className="space-y-3 overflow-y-auto scrollbar-none max-h-96 pr-2">
                {userLinks.length > 0 ? (
                  userLinks.map((lnk, i) => (
                    <a 
                      dir={`${language === "ar" ? "rtl" : "ltr"}`}
                      href={lnk.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={i}
                      className="flex border border-gray-200 shadow-sm duration-300 hover:bg-gray-50 items-center gap-3 rounded-xl p-3 group transition-all"
                    >
                      <div className="p-3 bg-teal-50 text-teal-600 rounded-full group-hover:bg-teal-100 transition-colors">
                        <LinkIcon size={20} />
                      </div>
                      <p className="text-base font-medium text-gray-700 break-all">{lnk.namelink}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-10 italic">
                    No business links available.
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserLinks;
