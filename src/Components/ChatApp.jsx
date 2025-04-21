import React, { useEffect, useState } from "react";
import SendMessgae from "./SendMessgae";
import ChatHeader from "./ChatHeader";
import ChatScreen from "./ChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { fetchChatById, unSetChatId } from "../app/slices/chatSlices";
import socket from "../Hooks/Socket";
import ChatDrawer from "../Utils/ChatDrawer";
import { SOCKET_EVENTS } from "../constants/event";

const ChatApp = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);
  const { selectedChatId, typing } = useOutletContext();
  const [systemMessage, setSystemMessage] = useState("");
  const [showChatAbout, setShowChatAbout] = useState(false);

  // useEffect(() => {
  //   // console.log("sended chatID in socket:", selectedChatId);
  //   socketMsgListner(dispatch, my_id, selectedChatId, setTyping);
  // }, [dispatch, selectedChatId, my_id, setTyping]);
  useEffect(() => {
    if (!selectedChatId) {
      // Cleanup when chat is unselected (back button clicked)
      console.log("⛔ No chat selected. Resetting chat state.");
      setSystemMessage("");
      // setTyping("");
      return;
    }
    dispatch(fetchChatById(selectedChatId));
  }, [selectedChatId, dispatch]);
  const my_id = authUser?._id;
  // console.log("active chat", activeChat);
  // console.log("active user", authUser);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.JOIN_CHAT, {
      chatId: selectedChatId,
      user: authUser,
    });
  }, [selectedChatId, authUser]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.USER_JOINED, ({ name }) => {
      setSystemMessage(`${name} joined the chat`);
      setTimeout(() => setSystemMessage(""), 3000); // Clear after 3 sec
    });

    return () => {
      socket.off("userJoined");
    };
  }, []);
  useEffect(() => {
    return () => {
      if (selectedChatId && authUser) {
        socket.emit(SOCKET_EVENTS.LEAVE_CHAT, {
          chatId: selectedChatId,
          user: authUser,
        });
      }
    };
  }, [selectedChatId, authUser, dispatch]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.USER_LEFT, ({ name }) => {
      setSystemMessage(`${name} left the chat`);
      setTimeout(() => setSystemMessage(""), 3000);
    });

    return () => {
      socket.off(SOCKET_EVENTS.USER_LEFT);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full max-h-screen bg-[var(--screen)]">
      {/* Chat header */}
      <div className="w-full h-16 flex items-center justify-between border-b">
        <ChatHeader
          chatData={activeChat}
          chatAbout={() => setShowChatAbout(!showChatAbout)}
        />
      </div>

      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
        <ChatScreen systemMessage={systemMessage} typinguser={typing} />
      </div>

      {/* Send Message Bar */}
      <div className="mb-1">
        <SendMessgae chatId={selectedChatId} />
      </div>

      {/* 🔥 ChatDrawer as Overlay */}
      {showChatAbout && (
        <div className="absolute inset-0 z-20  backdrop-blur-sm flex justify-end">
          <div className="lg:w-1/2 w-fullh-full bg-[var(--list)]  shadow-lg overflow-y-auto">
            <ChatDrawer
              chatId={selectedChatId}
              onClose={() => setShowChatAbout(false)}
            />
          </div>
        </div>
      )}
      {/* <ScrollToBottom /> */}
    </div>
  );
};

export default ChatApp;
