"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserX } from "lucide-react";
import ConfirmModal from "../ConfirmModal";

function Friends() {
  const {EmailUser, userDetails,setFriendRequests,
    friendRequests,socket,loadingFriendRequests} =
    useContext(MyContext);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const router = useRouter();

  const highlightText = (text) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.trim()})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const confirmDeleteRequest = async () => {
  if (!currentRequestId) return;

  setLoadingStatus((prev) => ({ ...prev, [currentRequestId]: { delete: true } }));
  try {
    const res = await axios.delete(`/api/proxy/friends/${currentRequestId}`);
    const requestTo = res.data.requestTo;
    const requestFrom = res.data.requestFrom;

    setFriendRequests(prevRequests => prevRequests.filter(request => request._id !== currentRequestId));

    toast("Unfriend successfully");
    socket.emit('deleteFriendRequest', { 
      to: requestFrom === EmailUser ? requestTo : requestFrom,
      id: currentRequestId
    });
  } catch (error) {
    console.error("Error deleting request:", error.message);
    toast.error("Failed to delete request");
  } finally {
    setLoadingStatus((prev) => ({ ...prev, [currentRequestId]: { delete: false } }));
    setIsConfirmOpen(false);
    setCurrentRequestId(null);
  }
};


  const FriendsCount = friendRequests.filter(
    (fl) =>
      fl.status === "accept" && (fl.to === EmailUser || fl.from === EmailUser)
  ).length;

  const filteredRequests = friendRequests
    .filter(
      (fl) =>
        fl.status === "accept" && (fl.to === EmailUser || fl.from === EmailUser)
    )
    .map((fl) => ({
      _id: fl._id,
      email: fl.to === EmailUser ? fl.from : fl.to,
    }));

  const searchResults = filteredRequests
    .map((request) => userDetails.find((user) => user.email === request.email))
    .filter(
      (user) =>
        user &&
        (user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div>
      <div className="flex items-center gap-2 justify-between bg-gray-900 pb-4 mb-2 w-full z-50">
        <div className="text-sm font-bold">{FriendsCount} Friends</div>
        <input
          type="text"
          placeholder="Search for friend requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500"
        />
      </div>

      {loadingFriendRequests ? (
        <div className="rounded-md mb-2 w-full flex-1">
          {[2].map((_, i) => (
            <div
              key={i}
              className="p-3 hover:scale-95 duration-300 bg-gray-800 w-full rounded-md mb-2 flex justify-between gap-5"
            >
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <p className="w-32 h-3 rounded-md bg-gray-400 animate-pulse"></p>
                  <p className="w-32 h-3 rounded-md bg-gray-400 animate-pulse"></p>
                </div>
              </div>
              <div className="flex text-xs bg-blue-600 py-1 px-1 rounded-lg items-center gap-1 justify-center">
                <span>
                  <UserX />
                </span>
                <span>Unfriend</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto max-h-60">
          {searchResults.map((user, i) => {
            const request = filteredRequests.find(
              (req) => req.email === user.email
            );
            const highlightedName = highlightText(user.fullname);
            const highlightedEmail = highlightText(user.email);

            return (
              <div key={i}>
                <div className="  hover:scale-95 duration-300 shadow-lg mb-2 bg-gray-800 rounded-xl flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center px-4 py-3 gap-2">
                    <Image
                      onClick={() => router.push(`/${user.username}`)}
                      src={user.urlimage}
                      alt={`${user.username}`}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                    />
                    <div>
                      <span className="block font-bold text-xs md:text-sm break-all line-clamp-1">
                        <span
                          dangerouslySetInnerHTML={{ __html: highlightedName }}
                        />
                      </span>
                      <span className="text-gray-400 text-xs break-all line-clamp-1">
                        <span
                          dangerouslySetInnerHTML={{ __html: highlightedEmail }}
                        />
                      </span>
                    </div>
                  </div>
                  {/* // Unfriend button */}
                  <div className="flex flex-row-reverse gap-2 mr-4">
                    <button
                      className="bg-blue-600 text-xs hover:scale-95 rounded-lg p-1 duration-200"
                       onClick={() => {
                         setCurrentRequestId(request._id);
                         setIsConfirmOpen(true);
                       }}
                      disabled={loadingStatus[request._id]?.delete}
                    >
                      {loadingStatus[request._id]?.delete ? (
                        <i className="fa fa-spinner fa-spin"></i>
                      ) : (
                        <div className="flex items-center gap-1 justify-center">
                          <span>
                            <UserX />
                          </span>
                          <span>Unfriend</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {(!loadingFriendRequests && filteredRequests.length === 0) && (
        <p className="text-sm py-5 flex items-center justify-center">
          You have no friends yet
        </p>
      )}
        <ConfirmModal
          isOpen={isConfirmOpen}
          message="Are you sure you want to delete this friend ?"
          onConfirm={confirmDeleteRequest}
          onCancel={() => {
            setIsConfirmOpen(false);
            setCurrentRequestId(null);
          }}
        />
    </div>
  );
}

export default Friends;
