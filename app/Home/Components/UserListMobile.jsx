"use client";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../../Context/MyContext";
import io from "socket.io-client";
import DOMPurify from 'dompurify';

function UserListMobile({ selectedUser, setSelectedUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersWithLastMessage, setUsersWithLastMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const lodd = Array.from({ length: 20 }, (_, index) => index + 1);
  const {SERVER_URL_V,EmailUser,messages} = useContext(MyContext);
  const router = useRouter();

   // 🟢 Fetch Users with Last Message
  useEffect(() => {
    const fetchUsersWithLastMessage = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${SERVER_URL_V}/chat-users`,
          { emailUser: EmailUser },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );
        setUsersWithLastMessage(res.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      } finally {
        setLoading(false);
      }
    };
    if (EmailUser) fetchUsersWithLastMessage();
  }, [SERVER_URL_V, EmailUser]);


  const handleUserClick = async (user, lastMessage) => {
    setSelectedUser(user);
    localStorage.setItem("SelectedUser", JSON.stringify(user));
    if (
      lastMessage?.from &&
      lastMessage?.to &&
      lastMessage?.readorno === false &&
      lastMessage?.to === EmailUser
    ) {
      try {
        const response = await axios.put(
          `${SERVER_URL_V}/readorno`,
          { fromEmail: lastMessage.from, toEmail: lastMessage.to },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
          }
        );
        setUsersWithLastMessage(prevUsers =>
          prevUsers.map(u =>
            u.email === user.email
              ? {
                  ...u,
                  lastMessage: { ...u.lastMessage, readorno: true },
                  unreadCount: 0,
                }
              : u
          )
        );
        console.log("Messages updated successfully:", response.data);
      } catch (error) {
        console.error(
          "Error updating readorno:",
          error.response ? error.response.data : error.message
        );
      }
    }
    // 🔽 Scroll to bottom
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    }, 100);
  };

  // Scroll To End
  useEffect(() => {
    const scrollMessagesToEnd = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    };
    const timeout = setTimeout(() => {
      scrollMessagesToEnd();
    }, 1);
    return () => clearTimeout(timeout);
  }, [messages]);

  const safeHighlightText = (text) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.trim()})`, "gi");
    const highlightedText = text.replace(regex, "<b>$1</b>");
    return DOMPurify.sanitize(highlightedText);
  };
  const formatLastMessage = (lastMessage, EmailUser, maxLength = 20) => {
  if (!lastMessage?.message) return "No messages yet";
  const prefix = lastMessage.from === EmailUser ? "you:" : "";
  const message =
    lastMessage.message.length > maxLength
      ? lastMessage.message.slice(0, maxLength) + "..."
      : lastMessage.message;

  return prefix + message;
};

  return (
    <div>
      <div className="bg-gray-800 w-screen text-white p-4 ">
        {/* Search input */}
        <input
          type="search"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none"
        />
        {/* Users List */}
        <div className="text-lg  border-yellow-500 font-bold mb-4 sticky top-0 border-b py-1 bg-gray-800 z-10">
          {searchQuery === "" ? "Friends" : "Users List"}
        </div>
        <div className=" overflow-y-auto  scrollbar-none ">
        <div>
              {/* Search User List */}
              <div className="overflow-y-auto max-h-[500px]  scrollbar-none">
                {usersWithLastMessage
                .filter(user =>
                  user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((User, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      handleUserClick(User, User.lastMessage);
                      router.push(`/message/to/${User.username}`);
                    }}
                    className={`flex relative items-center gap-4 p-2 mb-1 duration-500 hover:bg-gray-700 cursor-pointer rounded-lg transition ${
                      selectedUser?.email === User.email ? "bg-gray-700" : ""
                    }`}
                  >
                    {/* Profile Image */}
                    <Link href={`/${User.username}`} className="flex-shrink-0 relative w-12 h-12">
                      <Image
                        src={User.urlimage}
                        alt="Profile"
                        className="rounded-full"
                        layout="fill"
                      />
                    </Link>
                  
                    {/* User Info */}
                    <div className="flex flex-col ml-2">
                      <p
                        className="text-lg"
                        dangerouslySetInnerHTML={{ __html: safeHighlightText(User.fullname) }}
                      ></p>
                      {/* Last Message */}
                      <div className="flex items-center gap-1">
                        <p className="text-[14px] text-gray-400 line-clamp-1">
                          {formatLastMessage(User.lastMessage, EmailUser, 20)}
                        </p>
                        <p className={`${User.email === EmailUser && 'hidden'} text-sm text-gray-500`}>
                          {User.unreadCount > 0 ? `(${User.unreadCount})` : ""}
                        </p>
                      </div>
                    </div>
                  
                    {/* New Message Badge */}
                    {User.unreadCount > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-800 rounded-full px-1 text-[10px]">
                        new
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserListMobile;
