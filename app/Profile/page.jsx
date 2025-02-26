"use client";
import {
  Link2,
  MailCheck,
  MapPin,
  PenOff,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Button } from "@chakra-ui/react";
import { toast } from "sonner";
import { MyContext } from "../Context/MyContext";
import UserLinks from "../[username]/UserLinks";
import Loadingpage from "../Components/Loading/LoadingPage";
import QrcodeProfile from "./QrcodeProfile";
import CreateProfile from "../Components/CreateProfile";
import ParticleComponent from "../Components/ParticleComponent";

function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const { CLIENT_URL, userDetails, EmailUser } = useContext(MyContext);
  const [filtUser, setFiltUser] = useState(null);



  useEffect(() => {
    const FindUser = userDetails.find((fl) => fl.email === EmailUser);
    setFiltUser(FindUser);
  }, [userDetails, EmailUser]);


  if (!filtUser) {
    return <Loadingpage />;
  }
  const datasocial = [
    { key: "Linkedin", src: "/Icons/link.svg", alt: "LinkedIn" },
    { key: "github", src: "/Icons/github.svg", alt: "GitHub" },
    { key: "whatsapp", src: "/Icons/wts.svg", alt: "WhatsApp" },
    { key: "Telegram", src: "/Icons/tele.svg", alt: "Telegram" },
    { key: "messenger", src: "/Icons/messenger.svg", alt: "Messenger" },
    { key: "reddit", src: "/Icons/reddit.svg", alt: "Reddit" },
    { key: "twitch", src: "/Icons/twitch.svg", alt: "Twitch" },
    { key: "fb", src: "/Icons/fb.svg", alt: "Facebook" },
    { key: "instagram", src: "/Icons/ins.svg", alt: "Instagram" },
    { key: "Twitter", src: "/Icons/twit.svg", alt: "Twitter" },
    { key: "Youtube", src: "/Icons/yt.svg", alt: "YouTube" },
    { key: "snapchat", src: "/Icons/snap.svg", alt: "Snapchat" },
  ];

  const datamodul = filtUser
    ? [
        { name: "🔷 Summary", data: filtUser.bio },
        { name: "💼 Services", data: filtUser.services },
        { name: "🎓 Education", data: filtUser.education },
        { name: "⭐ Experience", data: filtUser.experience },
        { name: "💡 Skills", data: filtUser.skills },
        { name: "🌍 Languages", data: filtUser.languages },
      ]
    : [];

  const ListDisk = (data) => {
    return (
      <ul className="list-disc ml-6">
        {data.split("\n").map((sp, i) => (
          <li key={i}>{sp}</li>
        ))}
      </ul>
    );
  };
  if (!userDetails || userDetails.length === 0) {
    return <Loadingpage />
  }
  const filt = userDetails.find((fl) => fl.email === EmailUser);
  if (!filt) {
    return <CreateProfile />;
  }
  const CV = [
    {
      title: "🔷 Summary",
      content:filt?.bio
    },
    {
      title: "💼 Services",
      content:filt?.services
    },
    {
      title: "🎓 Education",
      content:filt?.education
    },
    {
      title: "⭐ Experience",
      content:filt?.experience
    },
    {
      title: "💡 Skills",
      content: filt?.skills
    },
    {
      title: "🌍 Languages",
      content: filt?.languages
    }
  ];
  
  return (
    <div>
      {userDetails.filter((fl) => fl.email === EmailUser)
        .map((UserF, i) => {
          return (
            <div key={i} className="relative">
          <ParticleComponent bgcolor={UserF.bgcolorp}/> 
           <div className={`flex items-start  justify-center text-xs md:text-base   pt-4 pb-20  ${UserF.bgcolorp}  `}>
            <div className={`w-[800px] mx-4 relative  bg-slate-50 px-4 md:px-8 pt-4 pb-8 rounded-lg border-2 shadow-lg`} >
              {/* Image Profile and info user */}
              <div className={`border flex flex-col md:flex-row sm:flex-row sm:items-start  md:items-start items- gap-2 sm:gap-5 md:gap-5 mb-3 p-4 bg-white rounded-lg shadow-md`}>
               <div className={` flex-shrink-0 flex items-center justify-cente`}>
                 <AlertDialog>
                   <AlertDialogTrigger>
                         <div>
                         <Image
                           width={140}
                           height={140}
                           src={UserF.urlimage}
                           alt="Profile Image"
                           className="object-cover md:block sm:block hidden cursor-pointer border-4  border-green-600 shadow-lg  rounded-full  duration-500"
                         />
                         <Image
                           width={100}
                           height={100}
                           src={UserF.urlimage}
                           alt="Profile Image"
                           className="object-cover md:hidden  sm:hidden block  cursor-pointer border-4  border-green-600 shadow-lg  rounded-full  duration-500"
                         />
                         </div>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogDescription className="flex justify-center">
                         <Image
                           width={250}
                           height={250}
                           src={UserF.urlimage}
                           alt="Profile Image"
                           className="object-cover rounded-full cursor-pointer"
                         />
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 duration-300 hover:scale-105">
                         Cancel
                       </AlertDialogCancel>
                       {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
               </div>
                {/* Content */}
                <div className="text-cente sm:text-left md:text-left">
             <h2 className="font-bold text-2xl text-gray-800">
               {UserF.fullname}
             </h2>
             {/* Email */}
             <p className="text-gray-600 flex items-center justify-cente md:justify-start gap-2 mt-1">
               <span className="text-green-500">
                 <MailCheck width={18} />
               </span>{" "}
               {UserF.email}
             </p>
             {/* Username and Country */}
             <p className="text-gray-600  flex  items-center justify-cente sm:justify-start md:justify-start md: gap-2 mt-1">
               <span className="text-green-900">@ {UserF.username}</span>
               {UserF.country && (
                 <span className="flex items-center gap-1 justify-cente">
                   <MapPin width={18} style={{ color: "red" }} />
                   {UserF.country}
                 </span>
               )}
             </p>
              {/* Phone Number and BLinks */}
             <div className="flex items-center gap-2 justify-cente sm:justify-start md:justify-start mt-">
              {UserF.phoneNumber && (
               <p className="text-green-800 flex items-center justify-cente sm:justify-start md:justify-start gap-2 mt-">
                 <Phone width={18} />
                 {UserF.phoneNumber}
               </p>
             )}
            {/* Business Links */}
            <div >
              <UserLinks emailuser={UserF.email} />
            </div>
             </div>
                  {/* datasocial */}
                  <div className="my-1">
                    <ul className="flex flex-wrap gap-4 justify-center">
                      {datasocial.map(
                        (item, i) =>
                          UserF[item.key] && (
                            <li key={i}>
                              <a
                                className="flex hover:scale-105 items-center justify-center bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-md border shadow-md transition duration-300"
                                href={UserF[item.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={item.src}
                                  width={22}
                                  height={22}
                                  alt={item.alt}
                                />
                                {/* <span className="ml-2 text-gray-800 font-medium">{item.alt}</span> */}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Setting */}
              <div className="absolute top-8 space-y-2 right-8 md:top-10  md:right-12">
                {/* Link to Update */}
                <Link
                  href={`/Profile/Update`}
                  className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-green-500 hover:scale-105 duration-500 p-2 rounded-full shadow-lg border border-teal-600 text-white transform transition-transform"
                >
                  <PenOff className="w-6 h-6" />
                </Link>
                {/* QrCode Profile */}
                <QrcodeProfile UserF={UserF} />
                {/* Link Profile */}
                <div
                  className="flex gap-2 hover:scale-105 duration-300 hover:text-sky-400  "
                  href={`/${UserF.username}`}
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-1 p-2 border rounded-full"
                      >
                        <Link2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Link Profile : </AlertDialogTitle>
                        <AlertDialogDescription className="flex justify-center gap-4">
                          <div>
                            <button
                              className="p-2 bg-green-300 rounded-md my-2 text-black font-medium"
                              onClick={() => {
                                const url = `${CLIENT_URL}/${UserF.username}`;

                                if (navigator.share) {
                                  navigator
                                    .share({
                                      url: url,
                                    })
                                    .then(() => console.log("Successful share"))
                                    .catch((error) =>
                                      console.log("Error sharing", error)
                                    );
                                } else {
                                  alert("Share not supported on this browser");
                                }
                              }}
                            >
                              Share Link
                            </button>
                          </div>
                          <button
                            className="p-2 bg-green-300 rounded-md my-2 text-black font-medium"
                            onClick={() => {
                              const urlToCopy = `${CLIENT_URL}/${UserF.username}`;
                              navigator.clipboard
                                .writeText(urlToCopy)
                                .then(() => {
                                  setCopied(true);
                                  toast("Copied successfully");
                                  setTimeout(() => setCopied(false), 2000);
                                });
                            }}
                          >
                            {copied ? "Copied!" : "Copy Link"} <br />
                          </button>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {/* category */}
              <p className="text-base font-semibold text-center text-gray-800 bg-gray-100 p-2 my-2 rounded border border-gray-300">
                {UserF.category}
              </p>
              {/* Modul */}
        <div className={` flex flex-wrap justify-center  gap-2 mb-2`}>
          {datamodul.map((dt, i) => {
            return (
              <div key={i}>
                <AlertDialog>
                  <AlertDialogTrigger
                    className={`p-2 ${
                      !dt.data && "hidden"
                    } bg-slate-100  hover:bg-slate-200 hover:scale-105 duration-300 rounded-lg border-2`}
                  >
                    {
                      <div className="flex gap-[2px]">
                        <div>{dt.name.split(" ")[0]}</div>
                        <div>{dt.name.split(" ")[1]}</div>
                      </div>
                    }
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={` bg-gray-200  p-2 border rounded-md`}>
                        <div className="text-start">{dt.name}</div>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="overflow-y-auto max-h-96 bg-sky-50  p-4 duration-300 rounded-sm border text-black whitespace-break-spaces text-start">
                        {dt.data}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 duration-300">
                        Cancel
                      </AlertDialogCancel>
                      {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>

              {/* CV */}
              <div className="mt-3">
              {CV.map(({ title, content, i }) =>
                  content && (
                    <div key={i} className="border p-4 text-right!? bg-white rounded-lg shadow-md mb-4 hover:scale-100 duration-500">
                      <h3 className={` text-xl font-semibold text-indigo-600 mb-2`}>{title}</h3>
                      <p className="text-gray-800 text-xs sm:text-base md:text-base  whitespace-pre-wrap leading-relaxed">{content}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          </div>
          )
          
        })}
    </div>
  );
}

export default ProfilePage;
