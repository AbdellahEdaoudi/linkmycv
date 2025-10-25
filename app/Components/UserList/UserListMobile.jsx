"use client";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../../Context/MyContext";
import DOMPurify from "dompurify";

function UserListMobile({ selectedUser, setSelectedUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const { SERVER_URL_V, setMessages, userDetails, EmailUser, messages } =
    useContext(MyContext);
  const router = useRouter();

  // Handle User Click
  const handleUserClick = async (user, lastMessage) => {
    try {
      setSelectedUser(user);
      localStorage.setItem("SelectedUser", JSON.stringify(user));

      if (lastMessage?.from && lastMessage?.to) {
        await axios.put(
          `${SERVER_URL_V}/readorno`,
          {
            fromEmail: lastMessage.from,
            toEmail: lastMessage.to,
          },
          { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
        );

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.from === lastMessage.from &&
            msg.to === lastMessage.to &&
            msg.readorno === false
              ? { ...msg, readorno: true }
              : msg
          )
        );
      }

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
      }, 1);
    } catch (error) {
      console.error(
        "Error handling user click:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Safe highlight for search
  const safeHighlightText = (text) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.trim()})`, "gi");
    return DOMPurify.sanitize(text.replace(regex, "<b>$1</b>"));
  };

  // Filter users with messages
  const filteredUserDetails = userDetails.filter(
    (user) =>
      user.email === EmailUser ||
      messages.some(
        (msg) =>
          (msg.from === EmailUser && msg.to === user.email) ||
          (msg.to === EmailUser && msg.from === user.email)
      )
  );

  // Map users with last message
  const userWithLastMessages = filteredUserDetails
    .map((user) => {
      const lastMessage = messages
        .filter(
          (msg) =>
            (msg.from === EmailUser && msg.to === user.email) ||
            (msg.to === EmailUser && msg.from === user.email)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      return { user, lastMessage };
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0) -
        new Date(a.lastMessage?.createdAt || 0)
    );

  return (
    <div className="bg-gray-800 w-screen text-white p-4">
      <input
        type="search"
        placeholder="Search by Name or Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none"
      />

      <div className="text-lg border-yellow-500 font-bold mb-4 sticky top-0 border-b py-1 bg-gray-800 z-10">
        {searchQuery === "" ? "Friends" : "Users List"}
      </div>

      <div className="overflow-y-auto max-h-[500px] scrollbar-none" ref={messagesEndRef}>
        {userWithLastMessages
          .filter(
            ({ user }) =>
              user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(({ user, lastMessage }, i) => {
            const unreadCount = messages.filter(
              (m) => m.to === EmailUser && m.from === user.email && !m.readorno
            ).length;

            return (
              <div
                key={i}
                onClick={() => {
                  handleUserClick(user, lastMessage);
                  router.push(`/message/to/${user.username}`);
                }}
                className={`flex items-center gap-4 p-2 mb-1 rounded-lg hover:bg-gray-700 cursor-pointer ${
                  selectedUser?.email === user.email ? "bg-gray-700" : ""
                } relative`}
              >
                <Link href={`/${user.username}`} className="flex-shrink-0 relative w-12 h-12">
                  <Image src={user.urlimage} alt="Profile" className="rounded-full" fill />
                </Link>
                <div className="flex flex-col flex-1">
                  <p
                    className="text-lg"
                    dangerouslySetInnerHTML={{ __html: safeHighlightText(user.fullname) }}
                  />
                  <p className=" hidden text-[10px] text-gray-400" dangerouslySetInnerHTML={{
                    __html: safeHighlightText(user.email),
                  }} />
                  <p className="text-[14px] text-gray-400 line-clamp-1">
                    {lastMessage
                      ? lastMessage.from === EmailUser
                        ? `you: ${lastMessage.message}`
                        : lastMessage.message
                      : "No messages yet"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-800 rounded-full px-1 text-[10px]">
                    {unreadCount > 1 ? `(${unreadCount})` : "new"}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserListMobile;
