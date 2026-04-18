"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Link,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { toast } from "../../Components/toast";
import { MyContext } from "../../Context/MyContext";
import UserLinks from "../UserLinks";
import FriendRequest from "../FriendRequest";
import SignInComponents from "../../Components/SignIn/SignInComponents";
import SignInComponents_CP from "../../Components/SignIn/SignInComponents_CP";
import QrcodeProfile from "../QrcodeProfile";
import { languagess } from "../../data/language";
import { signIn, useSession } from "next-auth/react";
import SocialMedia from "../SocialMedia"
import Loadingpage from "../../Components/Loading/LoadingPage";
import LoadingPagetranslate from "../../Components/Loading/LoadingPagetranslate";
import ParticleComponent from "../../Components/ParticleComponent";
import AccountNotFound from "../../Components/AccountNotFound";

function Page({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter()
  const path = usePathname();
  const {CLIENT_URL,SERVER_URL_V,userDetails,EmailUser}=useContext(MyContext);
  const [copied, setCopied] = useState(false);
  const [userDetailsG, setuserDetailsG] = useState([]);
  const [userLinks, setUserLinks] = useState([]);
  const [labels, setlabels] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  const filt = userDetails.find((fl) => fl.email === EmailUser);
  const language = params.Ln;
  const symbols = {summary: "🔷",services: "💼",education: "🎓",
                    experience: "⭐",skills: "💡",languages: "🌍"
                  };

  // Get users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true); 
      try {
        const res = await axios.get(`/api/proxy/users/${params.username}/${params.Ln}`);
        setuserDetailsG(res.data.user);
        setUserLinks(res.data.links);
        setlabels(res.data.labels);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [SERVER_URL_V,params.Ln,params.username]);

  const CopyLinkProfil = () => {
    const urlToCopy = `${CLIENT_URL}${path}`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      toast.success("Copied successfully");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === 'unauthenticated') {
    signIn("google", {redirect:true, callbackUrl:`/${userDetailsG?.username}`})
  }

  if (loadingUsers || userDetails.length === 0) {
    if (language === "ar") {
      return <LoadingPagetranslate language={language} bgcolorp="" />;
    } else {
      return <Loadingpage />;
    }
  }
  
  if (!userDetailsG && !loadingUsers) {
    return (
      <div>
        <AccountNotFound />
      </div>
    );
  }

  const emailuser = userDetailsG?.email;

  const datamodul = [
    { key: "summary", data: userDetailsG.bio },
    { key: "services", data: userDetailsG.services },
    { key: "education", data: userDetailsG.education },
    { key: "experience", data: userDetailsG.experience },
    { key: "skills", data: userDetailsG.skills },
    { key: "languages", data: userDetailsG.languages }
  ].map(({ key, data }) => ({
    name: `${symbols[key]} ${labels?.[key]}`,
    data,
    key
  }));

  const CV = [
    { key: "summary", content: userDetailsG.bio },
    { key: "services", content: userDetailsG.services },
    { key: "education", content: userDetailsG.education },
    { key: "experience", content: userDetailsG.experience },
    { key: "skills", content: userDetailsG.skills },
    { key: "languages", content: userDetailsG.languages }
  ].map(({ key, content }) => ({
    title:`${symbols[key]} ${labels?.[key]}`,
    content,
    key
  }));

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className={`flex items-start justify-center text-xs sm:text-base md:text-base pt-4 pb-20 relative ${userDetailsG.bgcolorp}`}>
      <ParticleComponent bgcolor={userDetailsG.bgcolorp} /> 
      <div className="w-[800px] mx-4 relative bg-slate-50 px-4 md:px-8 pt-4 pb-8 rounded-lg border-2 shadow-lg">
        {/* Image Profile and info user */}
        <div className={`${language === "ar" ? 'text-right' : 'text-left'} border flex flex-col md:flex-row sm:flex-row sm:items-start md:items-start items-center gap-2 sm:gap-5 md:gap-5 mb-3 p-4 bg-white rounded-lg shadow-md`}>
          <div className={`${language === "ar" ? 'ml-4' : ''} flex-shrink-0 flex items-center justify-center`}>
            <div onClick={() => setOpenImageModal(true)}>
              <Image
                width={140}
                height={140}
                src={userDetailsG.urlimage}
                alt="Profile Image"
                className="object-cover md:block sm:block hidden cursor-pointer border-4 border-green-600 shadow-lg rounded-full duration-500"
              />
              <Image
                width={100}
                height={100}
                src={userDetailsG.urlimage}
                alt="Profile Image"
                className="object-cover md:hidden sm:hidden block cursor-pointer border-4 border-green-600 shadow-lg rounded-full duration-500"
              />
            </div>

            {openImageModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white p-4 rounded-2xl relative shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenImageModal(false); }}
                    className="absolute -top-4 -right-4 bg-white p-2 rounded-full text-gray-500 hover:text-gray-800 shadow-lg transition-colors z-[110]"
                  >
                    <X size={24} />
                  </button>
                  <Image
                    width={400}
                    height={400}
                    src={userDetailsG.urlimage}
                    alt="Profile Large"
                    className="object-cover rounded-xl shadow-inner max-w-full max-h-[80vh]"
                  />
                </div>
              </div>
            )}
          </div>
          {/* Content */}
          <div className="space-y-2 text-center sm:text-left md:text-left flex-1">
             <h2 className="font-bold text-2xl text-gray-800">
               {userDetailsG.fullname}
             </h2>
             {/* Email */}
             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
               <span className="text-green-500">
                 <MailCheck width={18} />
               </span>{" "}
               {userDetailsG.email}
             </p>
             {/* Username and Country */}
             <p className="text-gray-600 flex items-center justify-center sm:justify-start md:justify-start gap-2">
               <span className="text-green-900">@ {userDetailsG.username}</span>
               {userDetailsG.country && (
                 <span className="flex items-center gap-1">
                   <MapPin width={18} style={{ color: "red" }} />
                   {userDetailsG.country}
                 </span>
               )}
             </p>
              {/* Phone Number and BLinks */}
             <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start md:justify-start ">
              {userDetailsG.phoneNumber && (
               <p className="text-green-800 flex items-center gap-2 ">
                 <Phone width={18} />
                 {userDetailsG.phoneNumber}
               </p>
             )}
            {/* Business Links */}
            <UserLinks userLinks={userLinks} language={language} labels={labels} />
             </div>
            {/* Social Media */}
            <SocialMedia userDetailsG={userDetailsG} />
          </div>
        </div>
        
        {/* Setting  */}
        <nav className={`${language === "ar" ? 'sm:left-24 md:left-24 left-7 top-10' : 'sm:right-10 md:right-24 right-7 top-10'} grid grid-cols-2 absolute sm:gap-5 md:gap-5 duration-300 gap-2`}>
          <button
            className="rounded-full hover:scale-110 flex justify-center hover:bg-gray-200 border h-10 w-10 p-2 duration-300 bg-white shadow-sm"
            onClick={CopyLinkProfil}
            title="Copy link"
          >
            {copied ? <p className="text-[10px] font-bold">OK</p> : <Link size={18} />}
          </button>
          
          <QrcodeProfile path={path} userDetailsG={userDetailsG} />
          
          <a
            className="hover:scale-110 duration-300 hover:text-green-700 bg-white border rounded-full h-10 w-10 flex items-center justify-center shadow-sm"
            href={`mailto:${userDetailsG.email}`}
          >
            <Mail width={20} />
          </a>

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
          
          <div className="absolute top-[120px] w-full">
            <select
              className="bg-white border cursor-pointer border-gray-300 rounded-md p-1 text-sm shadow-sm w-full"
              value={language}
              onChange={(e) => router.push(`/${params.username}/${e.target.value}`)}
            >
              {languagess.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </nav>

        {/* Category */}
        <p className="text-base font-semibold text-center text-gray-800 bg-gray-100 p-2 my-2 rounded border border-gray-300">
          {`${userDetailsG?.category}`}
        </p>

        {/* Modul */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {datamodul.map((dt, i) => {
            if (!dt.data) return null;
            return (
              <button
                key={i}
                onClick={() => setActiveModule(dt)}
                className="px-4 py-2 bg-white hover:bg-gray-50 hover:scale-105 duration-300 rounded-lg border-2 shadow-sm font-medium transition-all"
              >
                {dt.name}
              </button>
            );
          })}
        </div>

        {activeModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setActiveModule(null)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-6">
                <h2 className={`text-2xl font-bold text-gray-800 mb-4 bg-gray-50 border-b p-3 rounded-t-xl ${language === "ar" ? 'text-right' : 'text-left'}`}>
                  {activeModule.name}
                </h2>
                
                <div className={`overflow-y-auto max-h-[60vh] bg-sky-50/30 p-6 rounded-xl border border-sky-100 text-gray-800 whitespace-pre-wrap text-lg leading-relaxed ${language === "ar" ? 'text-right' : 'text-left'}`}>
                  {activeModule.data}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveModule(null)}
                    className="px-8 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CV */}
        <div className="mt-3">
          {CV.map(({ title, content, key }) =>
            content && (
              <div key={key} className="border p-4 bg-white rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300">
                <h3 className={`text-xl font-semibold text-indigo-600 mb-2 ${language === "ar" ? 'text-right' : 'text-left'}`}>
                  {title}
                </h3>
                <p className={`text-gray-800 break-words text-sm sm:text-base md:text-base whitespace-pre-wrap leading-relaxed ${language === "ar" ? 'text-right' : 'text-left'}`}>
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

export default Page;
