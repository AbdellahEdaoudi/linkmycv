"use client";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "../../Context/MyContext";
import DOMPurify from 'dompurify';

function UserListMobile({ selectedUser, setSelectedUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const lodd = Array.from({ length: 20 }, (_, index) => index + 1);
  const {
    SERVER_URL_V,
    setMessages,
    userDetails,
    EmailUser,
    messages,
  } = useContext(MyContext);
  const router = useRouter();

  // Handle User Click
  const handleUserClick = async (User, lastMessage) => {
  try {
    // تعيين المستخدم المختار وتخزينه في localStorage
    setSelectedUser(User);
    localStorage.setItem("SelectedUser", JSON.stringify(User));

    // تحديث حالة الرسائل المقروءة إذا كانت lastMessage موجودة
    if (lastMessage?.from && lastMessage?.to) {
      await axios.put(
        `${SERVER_URL_V}/readorno`,
        {
          fromEmail: lastMessage.from,
          toEmail: lastMessage.to,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      // تحديث الرسائل محليًا مباشرة باستخدام lastMessage
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.from === lastMessage.from &&
          message.to === lastMessage.to &&
          message.readorno === false
            ? { ...message, readorno: true }
            : message
        )
      );
    }

    // Scroll to the end of messages
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
  // Function to safely highlight search text
  const safeHighlightText = (text) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.trim()})`, "gi");
    const highlightedText = text.replace(regex, "<b>$1</b>");
    return DOMPurify.sanitize(highlightedText);
  };
  // Filter users who have exchanged messages with the logged-in user
  const filteredUserDetails = userDetails.filter(userDetail =>
    userDetail.email === EmailUser ||
    messages.some(msg =>
      (msg.from === EmailUser && msg.to === userDetail.email) ||
      (msg.to === EmailUser && msg.from === userDetail.email)
    )
  );
  // Map users to include their last message and sort by last message date
  const userWithLastMessages = filteredUserDetails.map(User => {
    const lastMessage = messages
      .filter(msg =>
        (msg.from === EmailUser && msg.to === User.email) ||
        (msg.to === EmailUser && msg.from === User.email)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  
    return { User, lastMessage };
  }).sort((a, b) =>
    new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
  );

  return (
    <div>
      <div className="bg-gray-800 w-screen text-white p-4 ">
        {/* Search input */}
        <input
          type="search"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                {userDetails
                  .filter(
                    (user) =>
                      user.fullname
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((User, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedUser(User);
                        // router.push(`/message/to/${User.username}`)
                        localStorage.setItem(
                          "SelectedUser",
                          JSON.stringify(User)
                        );
                        const scrollMessagesToEnd = () => {
                          if (messagesEndRef.current) {
                            messagesEndRef.current.scrollTop =
                              messagesEndRef.current.scrollHeight;
                          }
                        };
                        const timeout = setTimeout(() => {
                          scrollMessagesToEnd();
                        }, 1);
                        return () => clearTimeout(timeout);
                      }}
                      className={`${
                        searchQuery === "" ? "hidden" : ""
                      } flex items-center   pl-1 duration-500 hover:bg-gray-700 cursor-pointer rounded-lg transition ${
                        selectedUser && selectedUser.email === User.email
                          ? "bg-gray-700"
                          : ""
                      }`}
                    >
                      <div
                        onClick={()=>{router.push(`/${User.username}`);}}
                        className="relative w-12 h-12 ml-1">
                        <Image
                          src={User.urlimage}
                          alt="Profile"
                          className="rounded-full"
                          layout="fill"
                        />
                      </div>
                      <div
                        onClick={() =>
                          router.push(`/message/to/${User.username}`)
                        }
                        className="flex flex-col "
                      >
                        <div className="cursor-pointer p-3 ">
                        <p
                        className="text-lg"
                        dangerouslySetInnerHTML={{
                          __html: `${safeHighlightText(User.fullname)}`,
                        }}
                      ></p>
                        <p className="text-[10px] text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: `${safeHighlightText(User.email)}`,
                        }}>
                        </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {userWithLastMessages.map(({ User, lastMessage }, i) =>{
                      const MessgesLength = Array.from(
                        new Map(
                          messages
                            .filter(
                              (fl) => fl.to === EmailUser && fl.from === lastMessage?.from  && fl.readorno === false
                            )
                            .map((item) => [item.message, item])
                        ).values()
                      );
                      return (
                        <div
                        key={i}
                        onClick={() => {
                          handleUserClick(User, lastMessage);
                          router.push(`/message/to/${User.username}`)
                        }}
                        className={`${
                          searchQuery === "" ? "" : "hidden"
                        } flex relative items-center gap-4 p-2 mb-1 duration-500 hover:bg-gray-700 focus:bg-gray-400 cursor-pointer rounded-lg transition 
                         `}
                      >
                        <Link
                          href={`/${User.username}`}
                          className="flex-shrink-0 relative w-12 h-12 "
                        >
                          <Image
                            src={User.urlimage}
                            alt="Profile"
                            className="rounded-full"
                            layout="fill"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <p className="text-lg">{User.fullname}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-[14px] text-gray-400 line-clamp-1">
                            {lastMessage
                              ? lastMessage.from === EmailUser
                                ? `you: ${lastMessage.message} `
                                : `${lastMessage.message}`
                              : "No messages yet"}
                          </p>
                          <p className={`${User.email === EmailUser && 'hidden'} text-sm text-gray-500`}>
                          {MessgesLength.length > 1 ? `(${MessgesLength.length})` : MessgesLength.length === 1 ? "" : ""}
                          </p>
                          </div>
                        </div>
                        {lastMessage && (
                          <p
                            className={` 
                        ${
                          lastMessage.from === EmailUser &&
                          lastMessage.to === EmailUser &&
                          "hidden"
                        }
                        ${lastMessage.from === EmailUser && "hidden"}
                        ${
                          lastMessage.readorno && "hidden"
                        } absolute right-3 top-1/2 -translate-y-1/2 bg-sky-800 rounded-full px-1  text-[10px]`}
                          >
                            new
                          </p>
                        )}
                      </div>
                      )
                    })}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserListMobile;
