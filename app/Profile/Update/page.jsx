"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MyContext } from "../../Context/MyContext";
import { toast } from "../../Components/toast";
import { CheckCircle, X } from "lucide-react";
import ParticleComponent from "../../Components/ParticleComponent";
import UpdatePLoading from "../../Components/Loading/UpdatePLoading";

function NameUser() {
  const {EmailUser } =useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [urlimage, setUrlimage] = useState("");
  const [Imageprofil, setImageprofil] = useState(null);
  const [bio, setBio] = useState("");
  const [fb, setFb] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [messenger, setMessenger] = useState("");
  const [reddit, setReddit] = useState("");
  const [twitch, setTwitch] = useState("");
  const [instagram, setInstagram] = useState("");
  const [Twitter, setTwitter] = useState("");
  const [Linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [Youtube, setYoutube] = useState("");
  const [Telegram, setTelegram] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [bgcolorp, setbgcolorp] = useState("");
  const [skills, setSkills] = useState("");
  const [services, setServices] = useState("");
  const [languages, setLanguages] = useState("");
  const [category, setCategory] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [id, setid] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userUpdate, setuserUpdate] = useState("");
  const usernameInputRef = useRef(null);
  
  const [activeDialog, setActiveDialog] = useState(null);

    // Fetch user data based on EmailUser
    useEffect(() => {
      const fetchUser = async () => {
        if (!EmailUser) return;
        try {
          const res = await axios.get(`/api/proxy/users/getUser`);
          setuserUpdate(res.data);
          const User = res.data;
          setFullname(res.data.fullname);
          setEmail(User.email);
          setUsername(User.username);
          setPhoneNumber(User.phoneNumber);
          setCountry(User.country);
          setUrlimage(User.urlimage);
          setBio(User.bio);
          setFb(User.fb);
          setWhatsapp(User.whatsapp);
          setMessenger(User.messenger);
          setReddit(User.reddit);
          setTwitch(User.twitch);
          setInstagram(User.instagram);
          setTwitter(User.Twitter);
          setLinkedin(User.Linkedin);
          setGithub(User.github);
          setYoutube(User.Youtube);
          setTelegram(User.Telegram);
          setSnapchat(User.snapchat);
          setbgcolorp(User.bgcolorp);
          setSkills(User.skills);
          setServices(User.services);
          setLanguages(User.languages);
          setCategory(User.category);
          setEducation(User.education);
          setExperience(User.experience);
          setid(User._id);
        } catch (error) {
        } 
      };
      fetchUser();
    }, [EmailUser]);

  useEffect(() => {
    if (errorMessage && usernameInputRef.current) {
    usernameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    usernameInputRef.current.focus();
       }
  }, [errorMessage]);

  const datasocial = [
    { iconSrc: "/Icons/wts.svg", alt: "WhatsApp", state: whatsapp, setState: setWhatsapp, placeholder: "WhatsApp Link" },
    { iconSrc: "/Icons/link.svg", alt: "LinkedIn", state: Linkedin, setState: setLinkedin, placeholder: "LinkedIn Link" },
    { iconSrc: "/Icons/github.svg", alt: "GitHub", state: github, setState: setGithub, placeholder: "GitHub Link" },
    { iconSrc: "/Icons/tele.svg", alt: "Telegram", state: Telegram, setState: setTelegram, placeholder: "Telegram Link" },
    { iconSrc: "/Icons/messenger.svg", alt: "Messenger", state: messenger, setState: setMessenger, placeholder: "Messenger Link" },
    { iconSrc: "/Icons/twit.svg", alt: "Twitter", state: Twitter, setState: setTwitter, placeholder: "Twitter Link" },
    { iconSrc: "/Icons/fb.svg", alt: "Facebook", state: fb, setState: setFb, placeholder: "Facebook Link" },
    { iconSrc: "/Icons/reddit.svg", alt: "Reddit", state: reddit, setState: setReddit, placeholder: "Reddit Link" },
    { iconSrc: "/Icons/twitch.svg", alt: "Twitch", state: twitch, setState: setTwitch, placeholder: "Twitch Link" },
    { iconSrc: "/Icons/ins.svg", alt: "Instagram", state: instagram, setState: setInstagram, placeholder: "Instagram Link" },
    { iconSrc: "/Icons/yt.svg", alt: "YouTube", state: Youtube, setState: setYoutube, placeholder: "YouTube Link" },
    { iconSrc: "/Icons/snap.svg", alt: "Snapchat", state: snapchat, setState: setSnapchat, placeholder: "Snapchat Link" },
  ];

  const updateProfile = async (e) => {
  if(e) e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("fullname", fullname);
  formData.append("bgcolorp", bgcolorp);
  formData.append("email", email);
  formData.append("username", username);
  formData.append("phoneNumber", phoneNumber);
  formData.append("country", country);
  formData.append("bio", bio);
  formData.append("fb", fb);
  formData.append("whatsapp", whatsapp);
  formData.append("messenger", messenger);
  formData.append("reddit", reddit);
  formData.append("twitch", twitch);
  formData.append("instagram", instagram);
  formData.append("snapchat", snapchat);
  formData.append("Linkedin", Linkedin);
  formData.append("github", github);
  formData.append("Twitter", Twitter);
  formData.append("Youtube", Youtube);
  formData.append("Telegram", Telegram);
  formData.append("skills", skills);
  formData.append("education", education);
  formData.append("experience", experience);
  formData.append("category", category);
  formData.append("languages", languages);
  formData.append("services", services);
  formData.append("aboni", false);

  if (Imageprofil) {
    const imageData = await fetch(Imageprofil);
    const imageBlob = await imageData.blob();
    formData.append("urlimage", new File([imageBlob], "profile_image"));
  } else {
    formData.append("urlimage", urlimage);
  }

  try {
    const response = await axios.put(`/api/proxy/users/update/${email}`, formData);
    
    toast.success("Updated Successfully");
  } catch (error) {
    console.error("Error updating user details:", error);
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.error === "Username already exists"
    ) {
      setErrorMessage("Username already exists");
    }
  } finally {
    setLoading(false);
  }
};


  const ImageProfileUpCloudinary = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageprofil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!userUpdate || userUpdate.length === 0) {
    return <UpdatePLoading />;
  }

  if (userUpdate && email && email !== EmailUser) {
    return (
      <div className="flex justify-center items-start py-4 h-screen">
        <Image
          width={600}
          height={600}
          src="/prfl.png"
          alt="prfl.png"
          className="rounded-md object-cover"
        />
      </div>
    );
  }

  const datamodul = [
    { name: "Summary", emoji: "🔷", state: bio, setState: setBio },
    { name: "Services", emoji: "💼", state: services, setState: setServices },
    { name: "Education", emoji: "🎓", state: education, setState: setEducation },
    { name: "Experience", emoji: "⭐", state: experience, setState: setExperience },
    { name: "Skills", emoji: "💡", state: skills, setState: setSkills },
    { name: "Languages", emoji: "🌍", state: languages, setState: setLanguages },
  ];

  return (
    <section>
      {userUpdate && userUpdate.length !== 0 && (
        <div style={{ backgroundColor:bgcolorp }}
          className={`flex items-center justify-center text-xs md:text-base pt-4 pb-6 duration-300 min-h-screen`}
        >
          <ParticleComponent bgcolor={bgcolorp} />
          <form onSubmit={updateProfile} className="z-10">
            <div className="mx-4 md:w-[800px] px-4 md:px-8 pb-14 bg-white p-6 rounded-lg border-2 shadow-lg">
              <div className="flex flex-col md:flex-row items-start justify-between mb-8 space-y-8 md:space-y-0 md:space-x-8">
                {/* Profile Image Section */}
                <div className="flex md:ml-5 flex-col items-center bg-white shadow-xl border border-gray-200 rounded-lg p-6 w-full md:w-1/3">
                  <Image
                    src={Imageprofil || urlimage}
                    alt="Profile Image"
                    className="rounded-full w-40 h-40 object-cover mb-4 border-4 border-green-500 shadow-lg"
                    width={160}
                    height={160}
                  />
                  
                  <label
                    htmlFor="file-upload"
                    className="bg-gradient-to-r from-teal-400 to-green-500 text-white font-semibold rounded-full px-4 py-2 cursor-pointer transition duration-300 hover:scale-105"
                  >
                    Upload Image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    name="urlimage"
                    onChange={ImageProfileUpCloudinary}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* User Information Section */}
                <div className="bg-white shadow-xl text-xs md:text-base border border-gray-200 rounded-lg p-6 w-full md:w-2/3 space-y-4">
                  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    {fullname}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Fullname:
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        required
                        value={fullname}
                        onChange={(e) => {
                          const capitalizeWords = (str) => {
                            return str
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase())
                              .replace(/\s+/g, " ");
                          };
                          setFullname(capitalizeWords(e.target.value));
                        }}
                        className="bg-gray-100 border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Username:
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          const newValue = e.target.value
                            .replace(/[/\s]/g, "")
                            .toLowerCase();
                          setUsername(newValue);
                        }}
                        className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your username"
                        required
                      />
                      {errorMessage && (
                           <div className="text-red-600 mt-2 font-bold">
                             <span>{errorMessage}</span>
                           </div>
                        )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Country:
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Phone:
                      </label>
                      <input
                        type="number"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Category:
                      </label>
                      <input
                        type="text"
                        name="category"
                        placeholder="Doctor"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-gray-100 border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modul Quick Edit */}
              <div className="flex text-xs md:text-base flex-wrap gap-2 mb-8 justify-center">
                {datamodul.map((dt) => (
                  <button
                    key={dt.name}
                    type="button"
                    onClick={() => setActiveDialog({ type: 'modul', data: dt })}
                    className="p-2 bg-slate-50 hover:bg-slate-100 hover:scale-105 duration-300 rounded-lg border-2 flex gap-2 items-center"
                  >
                    <span>{dt.emoji}</span>
                    <span>{dt.name}</span>
                  </button>
                ))}
              </div>

              {/* Social Media Section */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl border">
                <h3 className="text-lg font-bold mb-4 text-center text-gray-700 border-b pb-2">Social Media Profiles</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {datasocial.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveDialog({ type: 'social', data: item })}
                      className="flex text-xs md:text-base items-center justify-center bg-white hover:bg-gray-100 p-3 rounded-full shadow-sm border transition duration-300 hover:scale-105"
                    >
                      <Image src={item.iconSrc} width={20} height={20} alt={item.alt} />
                      <span className="ml-2 text-gray-700 font-medium">{item.alt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Selection */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl border">
                <label htmlFor="bgcolorSelect" className="block mb-2 font-bold text-gray-700">
                  <h3 className="text-xl font-semibold mb-2">🏷️ Background Color :</h3>
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    id="bgcolorSelect"
                    className="w-24 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md"
                    value={bgcolorp}
                    onChange={(e) => setbgcolorp(e.target.value)}
                  />
                  <span className="font-mono text-gray-600">{bgcolorp}</span>
                </div>
              </div>

              {/* Detail Sections */}
              <div className="space-y-6">
                {datamodul.map((section, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border shadow-sm">
                    <h3 className="text-2xl font-semibold text-indigo-500 mb-3 flex items-center gap-2">
                      <span>{section.emoji}</span>
                      <span>{section.name}</span>
                    </h3>
                    <textarea
                      value={section.state}
                      onChange={(e) => section.setState(e.target.value)}
                      placeholder={`Enter your ${section.name.toLowerCase()}...`}
                      className="bg-gray-50 border text-xs md:text-base border-gray-300 rounded-xl w-full h-32 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Footer Save Button */}
              <div className="mt-10 flex justify-end items-center sticky bottom-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black hover:scale-105 transition-all text-lg disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      Updating <i className="fa fa-spinner fa-spin ml-2"></i>
                    </>
                  ) : (
                    "Save All Changes"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Custom Modal for Dialogs */}
          {activeDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white border rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button 
                  onClick={() => setActiveDialog(null)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    {activeDialog.type === 'social' && <Image src={activeDialog.data.iconSrc} width={30} height={30} alt={activeDialog.data.alt} />}
                    {activeDialog.type === 'modul' && <span className="text-2xl">{activeDialog.data.emoji}</span>}
                    <h2 className="text-2xl font-bold text-gray-800">
                      Edit {activeDialog.data.name || activeDialog.data.alt}
                    </h2>
                  </div>
                  
                  <div className="mb-8">
                    {activeDialog.type === 'modul' ? (
                      <textarea
                        autoFocus
                        value={activeDialog.data.state}
                        onChange={(e) => activeDialog.data.setState(e.target.value)}
                        placeholder={`Enter ${activeDialog.data.name}...`}
                        className="bg-gray-50 border border-gray-300 rounded-xl w-full h-48 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        autoFocus
                        type="url"
                        value={activeDialog.data.state}
                        onChange={(e) => activeDialog.data.setState(e.target.value)}
                        placeholder={activeDialog.data.placeholder}
                        className="bg-gray-50 border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setActiveDialog(null)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setActiveDialog(null)}
                      className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default NameUser;
