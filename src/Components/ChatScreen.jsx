import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { extractTime, groupMessagesByDate } from "../Utils/Formater";
import { fetchMessages } from "../app/slices/messageSlice";
import { RiCheckDoubleFill, RiCheckLine } from "react-icons/ri";
import { MediaViewer, AllMedia } from "../Utils/MediaViewer";

const MessageBubble = ({ message, currentUserId }) => {
  const [previewMedia, setPreviewMedia] = useState(null);
  const [allMedia, setAllMedia] = useState(null);
  const isSender = message.sender._id === currentUserId;
  const avatar = message.sender.avatar;
  const name = message.sender.name;
  const time = extractTime(message.createdAt);
  const seen =
    message.seenBy?.length > 0 ? <RiCheckDoubleFill /> : <RiCheckLine />;

  return (
    <div
      className={`flex ${
        isSender ? "justify-end" : "justify-start"
      } gap-2 mb-4`}
    >
      {/* Avatar for receiver */}
      {!isSender && (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}

      {/* Message bubble */}
      <div
        className={`relative max-w-[75%] sm:max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl ${
          isSender
            ? "bg-[var(--message-sender)] text-[var(--sender-text)] rounded-br-none"
            : "bg-[var(--message-receiver)] text-[var(--receiver-text)] rounded-bl-none"
        }`}
      >
        {/* Sender name for group messages (only non-senders) */}
        {!isSender && <div className="font-semibold text-sm mb-1">{name}</div>}

        {/* Message content */}
        {message.media?.length > 0 ? (
          <div
            className={`grid gap-2 mt-2 ${
              message.media.length === 1
                ? "grid-cols-1"
                : message.media.length === 2
                ? "grid-cols-2"
                : "grid-cols-2"
            }`}
          >
            {message.media.slice(0, 4).map((url, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                {url.includes(".mp4") ? (
                  <video
                    src={url}
                    onClick={() => setPreviewMedia(url)}
                    controls
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <img
                    src={url}
                    onClick={() => setPreviewMedia(url)}
                    alt={`media-${index}`}
                    className="w-full h-32 object-cover"
                  />
                )}

                {index === 3 && message.media.length > 4 && (
                  <div
                    onClick={() => setAllMedia(message.media)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold"
                  >
                    +{message.media.length - 4} more
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          message.content && (
            <p className="text-sm leading-relaxed mt-2">{message.content}</p>
          )
        )}

        {/* Footer with seen + time */}
        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
          {/* If you have reactions, you can map them here */}
          <div></div>
          <div className="flex items-center gap-2">
            <span>{time}</span>
            {isSender && <span className="text-white/80">{seen}</span>}
          </div>
        </div>
      </div>

      {/* Avatar for sender */}
      {isSender && (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}
      {previewMedia && (
        <MediaViewer
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
        />
      )}
      {allMedia && (
        <div className="">
          <AllMedia
            allMedia={allMedia}
            setAllMedia={setAllMedia}
            setPreviewMedia={setPreviewMedia}
          />
        </div>
      )}
    </div>
  );
};

const ChatScreen = ({ systemMessage, typinguser }) => {
  const { selectedChatId } = useOutletContext();
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  const { authUser } = useSelector((state) => state.auth);
  const my_id = authUser?._id;
  useEffect(() => {
    dispatch(fetchMessages(selectedChatId));
  }, [dispatch, selectedChatId]);
  // console.log("MESSAGES:", messages);
  // console.log("MY DATA:", authUser);
  // console.log(typinguser);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // useEffect(() => {
  //   console.log("typinguser updated:", typinguser);
  // }, [typinguser]);
  const groupedMessages = groupMessagesByDate(messages);
  // console.log(groupedMessages);

  return (
    <>
      <div className="h-full w-full p-6 bg-[var(--screen)] hide-scrollbar space-y-4">
        {Object.entries(groupedMessages).map(([dateLabel, group]) => (
          <div key={dateLabel} className="space-y-4">
            {/* Date Separator */}
            <div className="flex justify-center mb-2">
              <span className="bg-gray-200 text-black font-bold text-xs px-3 py-1 rounded">
                {dateLabel}
              </span>
              {/* <span className="bg-gray-200 text-black font-bold text-xs px-3 py-1 rounded">
                ─── {dateLabel} ───
              </span> */}
            </div>

            {/* Messages under this date */}
            {group.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                currentUserId={my_id}
              />
            ))}
          </div>
        ))}
        {/* {systemMessage && ( */}
        <small className="text-[var(--text)] italic"> {systemMessage}</small>
        {/* )}  */}
        {typinguser && (
          <small className="text-[var(--text)] italic">
            {" "}
            {typinguser} is typing...
          </small>
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
};

export default ChatScreen;
