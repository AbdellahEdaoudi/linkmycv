"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Image from "next/image";
import {
  Link,
  Mail,
  MailCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
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
import { MyContext } from "../Context/MyContext";
import UserLinks from "./UserLinks";
import Loadingpage from "../Components/Loading/LoadingPage";
import FriendRequest from "./FriendRequest";
import SignInComponents from "../Components/SignIn/SignInComponents";
import SignInComponents_CP from "../Components/SignIn/SignInComponents_CP";
import QrcodeProfile from "./QrcodeProfile";
import { languagess } from "../data/language";
import { signIn, useSession } from "next-auth/react";
import SocialMedia from "./SocialMedia"
import AccountNotFound from '../Components/AccountNotFound'
import ParticleComponent from "../Components/ParticleComponent";

function GetUserByUsername({ params }) {
  const { data, status } = useSession();
  const router = useRouter()
  const path = usePathname();
  const {CLIENT_URL,SERVER_URL_V,userDetails,EmailUser,
         loadingUsers,      
        }=useContext(MyContext);
  const userDetailsG = userDetails.find((user)=>user.username === params.username)
  const [copied, setCopied] = useState(false);
  const [translatedDetails, setTranslatedDetails] = useState(null);
  const [language, setLanguage] = useState('');
  const filt = userDetails.find((fl) => fl.email === EmailUser);
  const CopyLinkProfil = () => {
    const urlToCopy = `${CLIENT_URL}${path}`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      toast("Copied successfully");
      setTimeout(() => setCopied(false), 2000);
    });
  };


    if (loadingUsers || userDetails.length === 0) {
      return <Loadingpage />

    }
  
      if (!userDetailsG && !loadingUsers) {
      return (
        <div>
          <AccountNotFound />
        </div>
          );
        }

  const datamodul = [
    {
      name: translatedDetails 
        ? `🔷 ${translatedDetails.Summary}` 
        : "🔷 Summary",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Summary} 🔷` : `🔷 ${translatedDetails.Summary}`}` 
        : "🔷 Summary",
      data: translatedDetails && translatedDetails.bio ? translatedDetails.bio : userDetailsG.bio
    },
    {
      name: translatedDetails 
        ? `💼 ${translatedDetails.Services}` 
        : "💼 Services",
       namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Services} 💼` : `💼 ${translatedDetails.Services}`}` 
        : "💼 Services",
      data: translatedDetails && translatedDetails.services ? translatedDetails.services : userDetailsG.services
    },
    {
      name: translatedDetails 
        ? `🎓 ${translatedDetails.Education}` 
        : "🎓 Education",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Education} 🎓` : `🎓 ${translatedDetails.Education}`}` 
        : "🎓 Education",
      data: translatedDetails && translatedDetails.education ? translatedDetails.education : userDetailsG.education
    },
    {
      name: translatedDetails 
        ? `⭐ ${translatedDetails.Experience}` 
        : "⭐ Experience",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Experience} ⭐` : `⭐ ${translatedDetails.Experience}`}` 
        : "⭐ Experience",
      data: translatedDetails && translatedDetails.experience ? translatedDetails.experience : userDetailsG.experience
    },
    {
      name: translatedDetails 
        ? `💡 ${translatedDetails.Skills}` 
        : "💡 Skills",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Skills} 💡` : `💡 ${translatedDetails.Skills}`}` 
        : "💡 Skills",
      data: translatedDetails && translatedDetails.skills ? translatedDetails.skills : userDetailsG.skills
    },
    {
      name: translatedDetails 
        ? `🌍 ${translatedDetails.Languages}` 
        : "🌍 Languages",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Languages} 🌍` : `🌍 ${translatedDetails.Languages}`}` 
        : "🌍 Languages",
      data: translatedDetails && translatedDetails.languages ? translatedDetails.languages : userDetailsG.languages
    }
  ];
  
  
  
  const ListDisk = ( data ) => {
    return (
      <ul className={`list-disc  ml-4 ${language === "ar" ? 'list-disc-rtl mr-4' : 'list-disc-ltr ml-4 '}`}>
        {data.split("\n").map((item, i) => (
          <li key={i} className="text-base leading-relaxed list-outside">
            {item}
          </li>
        ))}
      </ul>
    );
  };
  const emailuser = userDetailsG?.email;

  const CV = [
    {
      title: `${translatedDetails ? `🔷 ${translatedDetails.Summary}` : "🔷 Summary"}`,
      content: translatedDetails && translatedDetails.bio ? translatedDetails.bio : userDetailsG.bio,
      key: translatedDetails ? translatedDetails.bioKey || 'bio' : 'bio'
    },
    {
      title: `${translatedDetails ? `💼 ${translatedDetails.Services}` : "💼 Services"}`,
      content: translatedDetails && translatedDetails.services ? translatedDetails.services : userDetailsG.services,
      key: translatedDetails ? translatedDetails.servicesKey || 'services' : 'services'
    },
    {
      title: `${translatedDetails ? `🎓 ${translatedDetails.Education}` : "🎓 Education"}`,
      content: translatedDetails && translatedDetails.education ? translatedDetails.education : userDetailsG.education,
      key: translatedDetails ? translatedDetails.educationKey || 'education' : 'education'
    },
    {
      title: `${translatedDetails ? `⭐ ${translatedDetails.Experience}` : "⭐ Experience"}`,
      content: translatedDetails && translatedDetails.experience ? translatedDetails.experience : userDetailsG.experience,
      key: translatedDetails ? translatedDetails.experienceKey || 'experience' : 'experience'
    },
    {
      title: `${translatedDetails ? `💡 ${translatedDetails.Skills}` : "💡 Skills"}`,
      content: translatedDetails && translatedDetails.skills ? translatedDetails.skills : userDetailsG.skills,
      key: translatedDetails ? translatedDetails.skillsKey || 'skills' : 'skills'
    },
    {
      title: `${translatedDetails ? `🌍 ${translatedDetails.Languages}` : "🌍 Languages"}`,
      content: translatedDetails && translatedDetails.languages ? translatedDetails.languages : userDetailsG.languages,
      key: translatedDetails ? translatedDetails.languagesKey || 'languages' : 'languages'
    }
  ];
  if (status === 'unauthenticated') {
    signIn("google", {redirect:true, callbackUrl:`/${userDetailsG?.username}`})
  }
  return (
    <div className={`flex items-start justify-center h-screen text-xs sm:text-base md:text-base  pt-4  pb-20 relative ${userDetailsG.bgcolorp}`}>
      <ParticleComponent  bgcolor={userDetailsG.bgcolorp} /> 
      <div className="w-[800px] mx-4 relative  bg-slate-50 px-4 md:px-8 pt-4 pb-8 rounded-lg border-2 shadow-lg">
        {/* Image Profile and info user */}
        <div className={`${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} border flex flex-col md:flex-row sm:flex-row sm:items-start  md:items-start items- gap-2 sm:gap-5 md:gap-5 mb-3 p-4 bg-white rounded-lg shadow-md`}>
          <div className={`${language === "ar" ? 'ml-4' : ''} flex-shrink-0 flex items-center justify-cente`}>
            <AlertDialog>
              <AlertDialogTrigger>
                    <div>
                    <Image
                      width={140}
                      height={140}
                      src={userDetailsG.urlimage}
                      alt="Profile Image"
                      className="object-cover md:block sm:block hidden cursor-pointer border-4  border-green-600 shadow-lg  rounded-full  duration-500"
                    />
                    <Image
                      width={100}
                      height={100}
                      src={userDetailsG.urlimage}
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
                      src={userDetailsG.urlimage}
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
          <div className="space-y-2 text-cente sm:text-left md:text-left">
             <h2 className="font-bold text-2xl text-gray-800">
               {userDetailsG.fullname}
             </h2>
             {/* Email */}
             <p className="text-gray-600 flex items-center justify-cente md:justify-start gap-2">
               <span className="text-green-500">
                 <MailCheck width={18} />
               </span>{" "}
               {userDetailsG.email}
             </p>
             {/* Username and Country */}
             <p className="text-gray-600  flex  items-center justify-cente sm:justify-start md:justify-start gap-2">
               <span className="text-green-900">@ {userDetailsG.username}</span>
               {userDetailsG.country && (
                 <span className="flex items-center gap-1 justify-cente">
                   <MapPin width={18} style={{ color: "red" }} />
                   {userDetailsG.country}
                 </span>
               )}
             </p>
              {/* Phone Number and BLinks */}
             <div className="flex items-center gap-2 justify-cente sm:justify-start md:justify-start ">
              {userDetailsG.phoneNumber && (
               <p className="text-green-800 flex items-center justify-cente sm:justify-start md:justify-start gap-2 ">
                 <Phone width={18} />
                 {userDetailsG.phoneNumber}
               </p>
             )}
            {/* Business Links */}
            <div className={`${language === "ar" && "text-right"} `}>
              <UserLinks language={language} setLanguage={setLanguage} emailuser={emailuser} />
            </div>
             </div>
             
            {/* Social Media */}
            <div>
            <SocialMedia userDetailsG={userDetailsG} />
            </div>
          </div>
        </div>
        {/* Setting  */}
        <nav className={`${language === "ar" ? 'list-disc-rtl sm:left-24 md:left-24 left-7 top-10' : 'list-disc-ltr sm:right-10  md:right-24 right-7 top-10'} grid grid-cols-2 sm:grid-cols-2  md:grid-cols-2 absolute sm:gap-5  md:gap-5 duration-300 gap-2`}>
          {/* CopyLinkProfil */}
          <button
            className="rounded-full hover:scale-110 flex justify-center hover:bg-gray-200 border h-10 w-10 p-2  duration-300"
            onClick={CopyLinkProfil}
            title="Copy link"
          >
            {copied ? <p className="text-[14px]">Copied!</p> : <Link />} <br />
          </button>
          {/* Modal Qr and Link */}
          <QrcodeProfile path={path} userDetailsG={userDetailsG} />
          {/* Email User */}
          <span className="flex gap-2 border p-2 rounded-full w-10 cursor-pointer hover:text-red-700 hover:scale-110 duration-200  ">
            <a
              className="hover:scale-105 duration-500 hover:text-green-700"
              href={`mailto:${userDetailsG.email}`}
            >
              <Mail width={23} />
            </a>
          </span>
          {/* messageTo */}
          {(status === "authenticated" && filt) && (
            <FriendRequest
              userDetailsG={userDetailsG}
              emailuser={emailuser}
              path={path}
            />
          )}
          {status === "unauthenticated" && (
            <SignInComponents userDetailsG={userDetailsG} />
          )}
          {(status === "authenticated" && !filt ) && (
            <SignInComponents_CP userDetailsG={userDetailsG} />
          )}
          {/* translate */}
          <div className="absolute sm:top-[116px] md:top-[113px] top-[110px] md:-right-1 w-full duration-300">
            <select
              className="bg-white border cursor-pointer border-gray-300 rounded-md mb-6 w-full"
              onChange={(e) => router.push(`/${params.username}/${e.target.value}`)}
            >
              {languagess.map((lang) => (
                <option className="text-center" key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

        </nav>
        {/* Category */}
        <p className="text-base font-semibold text-center text-gray-800 bg-gray-100 p-2 my-2 rounded border border-gray-300">
        {`${translatedDetails ? translatedDetails.category : userDetailsG.category}`}
        </p>
        {/* Modul */}
        <div className={` ${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} flex flex-wrap justify-center  gap-2 mb-2`}>
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
        {CV.map(({ title, content, key }) =>
            content && (
              <div key={key} className="border p-4 text-right!? bg-white rounded-lg shadow-md mb-4 hover:scale-100 duration-500">
                <h3 className={`${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} 
                 text-xl font-semibold text-indigo-600 mb-2`}>
                  {title}
                </h3>
                <p className="text-gray-800 text-xs sm:text-base md:text-base  whitespace-pre-wrap leading-relaxed">
                  {content}
                </p>
              </div>
            )
          )}
        </div>

        
      </div>
    </div>
  );
}

export default GetUserByUsername;
