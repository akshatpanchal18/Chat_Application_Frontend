import React, { useRef, useState } from "react";
import { HiOutlinePaperAirplane, HiOutlinePaperClip } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../app/slices/messageSlice";
import socket from "../Hooks/Socket";

const SendMessgae = ({ chatId }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.message);
  const myId = authUser?._id;
  const [textMsg, setTextMsg] = useState("");
  const [media, setMedia] = useState([]);
  const typingTimeout = useRef(null);
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMedia((prevMedia) => [...prevMedia, ...files]);
    }
  };
  const handleTyping = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    socket.emit("typing", {
      chatId,
      userId: myId,
      name: authUser.name,
    });

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId });
    }, 3000); // Stop typing after 3 seconds of inactivity
  };
  const handleSendMessage = () => {
    handleTyping();
    const formData = new FormData();
    formData.append("content", textMsg);
    formData.append("chatId", chatId);
    media.forEach((file) => {
      formData.append("media", file);
    });
    dispatch(sendMessage({ formData }));
    setMedia([]);
    setTextMsg("");

    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
  };
  const handleRemoveFile = (index) => {
    const updatedMedia = media.filter((_, idx) => idx !== index);
    setMedia(updatedMedia);
  };

  const renderFilePreview = (file, index) => {
    const fileExt = file.name.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt);
    const isVideo = ["mp4", "webm", "ogg"].includes(fileExt);

    return (
      <div key={index} className="relative bg-transparent">
        {/* File Preview */}
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={`media-${index}`}
            className="w-32 h-32 object-cover rounded-lg"
          />
        ) : (
          <video
            controls
            src={URL.createObjectURL(file)}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
        {/* Delete Button */}
        <button
          onClick={() => handleRemoveFile(index)}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
        >
          X
        </button>
      </div>
    );
  };
  return (
    <div className=" relative w-full mx-auto p-2">
      <div className="flex items-center bg-[var(--list)] rounded-full px-4 py-2">
        {/* Attachment Icon */}
        <label>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFile}
          />
          <HiOutlinePaperClip size={28} className="text-[var(--icon)]" />
        </label>

        {/* Input Field */}
        <textarea
          rows="1"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          onKeyUp={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && textMsg.trim()) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`${isLoading ? "Sending...." : "Type Your message"}`}
          className="flex-1 bg-transparent outline-none px-3 text-sm text-[var(--text)] placeholder-[var(--text)] resize-none overflow-hidden"
          style={{ height: "25px", maxHeight: "auto", overflowY: "auto" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        {/* <input
          type="text"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          onKeyUp={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && textMsg.trim()) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`${isLoading ? "Sending...." : "Type Your message"}`}
          className="flex-1 bg-transparent outline-none px-3 text-sm text-gray-700 placeholder-gray-400"
        /> */}

        {/* Send Icon */}
        <button onClick={handleSendMessage} className="text-[var(--icon)]">
          <HiOutlinePaperAirplane size={28} />
        </button>
      </div>
      {media.length > 0 && (
        <div className="absolute bottom-14 left-4 flex gap-2 mt-2 bg-white p-2 rounded-lg shadow-md max-w-lg overflow-x-scroll no-scrollbar">
          {media.map((file, index) => renderFilePreview(file, index))}
        </div>
      )}
    </div>
  );
};

export default SendMessgae;
