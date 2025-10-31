"use client"
import { useContext, useEffect, useState } from "react";
import ChatHome from "../Components/ChatHome";
import CreateProfile from "../Components/CreateProfile";
import LoadChatPage from "../Components/Loading/LoadChatPage";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MyContext } from "../Context/MyContext";

export default function Home() {
  const { EmailUser, loadingAll, SERVER_URL_V } = useContext(MyContext);
  const { status } = useSession();
  const Router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google", { redirect: true, callbackUrl: `/Home` });
    }
  }, [status, Router]);
  // Fetch user data based on EmailUser
  useEffect(() => {
    const fetchUser = async () => {
      if (!EmailUser) return;
      setLoadingUser(true);
      try {
        const res = await axios.get(`/api/proxy/users/getUser`);
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [EmailUser]);

  if (loadingAll || loadingUser || !EmailUser) return <LoadChatPage />;

  if (!loadingAll && !user && status === "authenticated") return <CreateProfile />;

  return <ChatHome />;
}
