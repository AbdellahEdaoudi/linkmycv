"use client";
import React, {useContext, useState } from "react";
import Messages from "./Messages";
import UserListMobile from "../Components/UserList/UserListMobile";
import UserList from "../Components/UserList/UserList";
import { MyContext } from "../Context/MyContext";

function ChatHome() {
  const {selectedUser, setSelectedUser} = useContext(MyContext);

  
  return (
    <div>
      {/* LAPTOP */}
      <div className="md:block sm:block hidden duration-500">
        <div className="flex flex-row overflow-hidden  ">
          {/* Users list */}
          <nav className="w-72 min-w-72 flex-shrink-0 z-10">
            <UserList
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </nav>
          {/* Message window on the right */}
          <nav className={`${selectedUser ? "" : "hidden"} w-full z-10`}>
            <Messages selectedUser={selectedUser} />
          </nav>
        </div>
      </div>
      {/* MOBILE */}
      <div className="md:hidden sm:hidden block">
        <div className="w-1/6 z-10">
          <UserListMobile
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatHome;