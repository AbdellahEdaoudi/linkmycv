"use client"
import { useContext, useEffect } from "react";
import ChatHome from "../Components/ChatHome";
import { MyContext } from "../Context/MyContext";
import CreateProfile from "../Components/CreateProfile";
import LoadChatPage from "../Components/Loading/LoadChatPage";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default  function Home() {
  const { userDetails, EmailUser,loadingMessages,loadingUsers } = useContext(MyContext);
  const { data, status } = useSession();
  const Router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
        signIn("google", {redirect:true, callbackUrl:`/Home`})
    }
  }, [status, Router]);
  
  if (loadingMessages || loadingUsers) {
    return <LoadChatPage />;
  }
  const filt = userDetails.find((fl) => fl.email === EmailUser);
  if (!filt) {
    return <CreateProfile />;
  }
  return (
    <div>
      <ChatHome />
    </div>
  );
}
