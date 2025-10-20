"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import DOMPurify from "dompurify";
import { MyContext } from "../../Context/MyContext";
import LoadUserList from "../Components/Loading/LoadUserList";

function UserList({ selectedUser, setSelectedUser }) {
  const {EmailUser, SERVER_URL_V} = useContext(MyContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersWithLastMessage, setUsersWithLastMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

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


  // 🟡 Handle user click
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

  // 🔍 Filtered search
  const filteredUsers = usersWithLastMessage.filter(
    user =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✨ Highlight search text
  const highlightText = text => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.trim()})`, "gi");
    const highlightedText = text.replace(regex, "<b>$1</b>");
    return DOMPurify.sanitize(highlightedText);
  };
  const formatLastMessage = (lastMessage, EmailUser, maxLength = 20) => {
  if (!lastMessage?.message) return "No messages yet";

  const prefix = lastMessage.from === EmailUser ? "you: " : "";
  const message =
    lastMessage.message.length > maxLength
      ? lastMessage.message.slice(0, maxLength) + "..."
      : lastMessage.message;

  return prefix + message;
};


  // ⏳ Loading state
  if (loading || !EmailUser) {
    return (
      <div className="p-4">
        <LoadUserList />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-b-sm text-white p-4">
      {/* 🔎 Search Input */}
      <input
        type="search"
        placeholder="Search by Name or Email"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none"
      />

      {/* 🧭 Title */}
      <div className="text-lg font-bold mb-4 sticky top-0 border-b border-yellow-500 py-1 bg-gray-800 z-10">
        {searchQuery === "" ? "Friends" : "Users List"}
      </div>

      {/* 🧑‍🤝‍🧑 Users List */}
      <div className="overflow-y-auto h-[65.3vh] max-h-[75vh] scrollbar-none">
        {/* 🔍 Search results */}
        {usersWithLastMessage
          .filter(user =>
            user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((user, i) => (
            <div
              key={i}
              onClick={() => handleUserClick(user, user.lastMessage)}
              className={`mt-1 flex relative items-center gap-4 p-2 duration-300 hover:bg-gray-700 cursor-pointer rounded-lg transition ${
                selectedUser?.email === user.email ? "bg-gray-700" : ""
              }`}
            >
              <div className="relative flex-shrink-0 w-12 h-12">
                <Image
                  src={user.urlimage}
                  alt="Profile"
                  className="rounded-full"
                  layout="fill"
                />
              </div>
            
              <div className="flex flex-col">
                 <p
                    className="text-lg"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(user.fullname),
                    }}
                  ></p>
                <div className="flex items-center gap-1">
                  <p className="text-[14px] text-gray-400 line-clamp-1">
                    {formatLastMessage(user.lastMessage, EmailUser, 20)}
                  </p>
                  <p
                    className={`${
                      user.email === EmailUser && "hidden"
                    } text-sm text-gray-500`}
                  >
                    {user.unreadCount > 0 ? `(${user.unreadCount})` : ""}
                  </p>
                </div>
              </div>
                  
              {user.unreadCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-800 rounded-full px-1 text-[10px]">
                  new
                </span>
              )}
            </div>
          ))}

      </div>
    </div>
  );
}

export default UserList;
