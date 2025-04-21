import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";
import { BiCheckDouble } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchChat, setChatId } from "../app/slices/chatSlices";
import { CiImageOn, CiVideoOn, CiFileOn } from "react-icons/ci";
import { extractTime } from "../Utils/Formater";
import { ChatListSkelaton } from "../Utils/Skelaton";
import { clearUnread } from "../app/slices/notificationSlice";

const ChatList = ({ onSelect }) => {
  const dispatch = useDispatch();
  const { chatList, isLoading } = useSelector((state) => state.chat);
  const { notification } = useSelector((state) => state.notification);
  const onlineStatus = useSelector((state) => state.auth.onlineStatus); // from auth slice
  const my_id = useSelector((state) => state.auth.authUser?._id);
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   console.log(
  //     "📣 Notification State:",
  //     JSON.stringify(notification, null, 2)
  //   );
  // }, [notification]);

  // console.log("my id", my_id);
  // console.log("isOnline", isOnline);
  // console.log("online status:", onlineStatus);

  useEffect(() => {
    dispatch(fetchChat(search));
  }, [dispatch, search]);
  // console.log("Chat list",chatList);
  // if (!chatList || chatList.length === 0) {
  //   return <div>No chats available</div>;
  // }
  const handleSelectChat = (chatId) => {
    dispatch(clearUnread(chatId));
    // onSelect(chatId);
    dispatch(setChatId(chatId));
  };
  return (
    <div className="h-full w-full flex flex-col p-4 rounded-xl bg-[var(--screen)]">
      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute top-3 left-3 text-[var(--text)]" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--list)] text-sm focus:outline-none placeholder:text-[var(--text)] text-[var(--text)]"
        />
      </div>

      {/* Chat Items */}
      <div
        className="space-y-4 h-full overflow-y-auto scrollbar-width-none 
  [&::-webkit-scrollbar]:hidden"
      >
        {isLoading
          ? // Show 7 skeletons while loading
            Array.from({ length: 7 }).map((_, index) => (
              <ChatListSkelaton key={index} />
            ))
          : chatList.map((chat) => {
              const isOnline = onlineStatus[chat?.otherUser_id] || false;
              const unreadCount = notification[chat._id];

              const messageType = (
                <span className="flex items-center gap-1 text-xs text-gray-500 truncate w-36">
                  {chat.messageType === "image" ? (
                    <>
                      <CiImageOn fontSize={15} />
                      Photo
                    </>
                  ) : chat.messageType === "video" ? (
                    <>
                      <CiVideoOn fontSize={15} />
                      Video
                    </>
                  ) : chat.messageType === "file" ? (
                    <>
                      <CiFileOn fontSize={15} />
                      File
                    </>
                  ) : (
                    "No messages yet"
                  )}
                </span>
              );

              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`flex items-center justify-between cursor-pointer ${
                    unreadCount ? " bg-indigo-100" : "bg-[var(--list)]"
                  } p-2 rounded-xl transition mb-2`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          chat.image ||
                          `https://ui-avatars.com/api/?background=0D8ABC&color=ffffff&name=${chat.name}`
                        }
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {!chat.isGroupChat && (
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 w-max">
                      <p className="font-medium text-[var(--text)] capitalize truncate">
                        {chat.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage ? chat.lastMessage : messageType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-xs gap-1">
                    <span className="text-[var(--text)] flex text-xs items-center gap-1">
                      {extractTime(chat.lastMessageTime)}
                    </span>

                    {unreadCount > 0 && (
                      <span className="bg-[var(--badge)] text-white text-[10px] px-1.5 py-1.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ChatList;
