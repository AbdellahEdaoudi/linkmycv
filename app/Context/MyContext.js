"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useRef, useState } from 'react';
import { apiRequest } from '../Admin/Components/apiRequest'
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
   const [userDetails, setUserDetails] = useState([]);
   const [userLinks, setUserLinks] = useState([]);
   const [messages, setMessages] = useState([]);
   const [friendRequests, setFriendRequests] = useState([]);
   const [socket, setSocket] = useState(null);
   const {data,status} = useSession()
   const EmailUser = data?.user?.email
   const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
   const [previousfriendRequests, setPreviousfriendRequests] = useState(0);
   const [loadingUsers, setLoadingUsers] = useState(false);
   const [loadingMessages, setLoadingMessages] = useState(false);
   const [loadingFriendRequests, setLoadingFriendRequests] = useState(false);
   const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL ;
   const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;
   const SERVER_URL_V = process.env.NEXT_PUBLIC_SERVER_URL_V ;
   const audioRef = useRef(null);
   const [selectedUser, setSelectedUser] = useState(null);
   useEffect(() => {
     const storedUser = localStorage.getItem("SelectedUser");
     if (storedUser) {
       setSelectedUser(JSON.parse(storedUser));
     }
   }, []);

  // socket.io
  useEffect(() => {
    const socket = io(SERVER_URL);
    setSocket(socket);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on("receiveUpdatedMessage", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });
    socket.on("receiveDeletedMessage", (deletedMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== deletedMessageId)
      );
    });

    socket.on("receiveFriendRequest", (newRequest) => {
      setFriendRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    socket.on("receiveUpdatedFriendRequest", (updatedRequest) => {
      setFriendRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
    });

    socket.on("receiveDeletedFriendRequest", (deletedRequestId) => {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== deletedRequestId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [SERVER_URL]);

  useEffect(() => {
    const email = EmailUser; 
    if (email) {
      socket.emit('userConnected',email);
    } else {
      // console.error('User email is not available.');
    }
  }, [EmailUser, socket]);
  
  // Get users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true); // بدأ اللودينغ
      try {
        const res = await axios.get(`${SERVER_URL_V}/users`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
          }
        });
        setUserDetails(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingUsers(false); // انتهاء اللودينغ
      }
    };

    fetchUsers();
  }, [SERVER_URL_V]);

  // Get messages
  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true); // بدأ اللودينغ
      try {
        const response = await axios.get(`${SERVER_URL}/messages/${EmailUser}`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false); // انتهاء اللودينغ
      }
    };

    getMessages();
  }, [EmailUser, SERVER_URL]);

  // Get links
  useEffect(() => {
    axios
      .get(`${SERVER_URL_V}/links`,{
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` 
        }
      })
      .then((res) => {
        setUserLinks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [SERVER_URL_V]);

  // GetFriendRequest
  useEffect(() => {
    const GetFriendRequest = async () => {
      try {
        setLoadingFriendRequests(true);
        const response = await axios.get(`${SERVER_URL_V}/friend`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        });
        setFriendRequests(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching friend requests",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoadingFriendRequests(false); // إنهاء اللودينغ
      }
    };

    GetFriendRequest();
  }, [SERVER_URL_V]);


  const latestNotifications = messages
  .filter((fl) => fl.to === EmailUser && fl.from !== EmailUser && fl.readorno === false)
  .reduce((acc, msg) => {
    if (!acc[msg.from] || new Date(acc[msg.from].createdAt) < new Date(msg.createdAt)) {
      acc[msg.from] = msg;
    }
    return acc;
  }, {});

const Notification = Object.values(latestNotifications);
const Requests = friendRequests
.filter(fl => fl.status === "pending" && fl.to === EmailUser) 
.filter((fl, index, self) =>
  index === self.findIndex((t) => (
    t._id === fl._id 
  ))
);

  useEffect(() => {
    if (Notification.length > previousNotificationCount) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setPreviousNotificationCount(Notification.length);
  }, [Notification.length, previousNotificationCount]);
  
  useEffect(() => {
    if (Requests.length > previousfriendRequests) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setPreviousfriendRequests(Requests.length);
  }, [Requests.length, previousfriendRequests]);

  return (
    <MyContext.Provider
      value={{
        CLIENT_URL,
        SERVER_URL,
        userDetails,
        setUserDetails,
        userLinks,
        setUserLinks,
        EmailUser,
        Notification,
        SERVER_URL_V,
        messages,
        setMessages,
        socket,selectedUser, setSelectedUser,
        friendRequests, setFriendRequests,
        Requests , loadingMessages,loadingUsers , loadingFriendRequests
      }}
    >
      <audio ref={audioRef} src="/notification3.mp3" preload="auto" />
      {children}
    </MyContext.Provider>
  );
};
