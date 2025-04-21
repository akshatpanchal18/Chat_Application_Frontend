import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { userProfilewithChatData } from "../app/slices/userSlice";
import { MdOutlineGroups } from "react-icons/md";
import { MediaViewer } from "./MediaViewer";

const ChatDrawer = ({ chatId, onClose }) => {
  const dispatch = useDispatch();
  const { userChat, isLoading } = useSelector((state) => state.user);
  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    dispatch(userProfilewithChatData(chatId));
  }, [chatId, dispatch]);

  console.log(userChat);

  const maxVisible = 3;

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="relative pt-10 flex flex-col items-center justify-center bg-[var(--list)] text-[var(--text)]">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
              <IoArrowBack
                onClick={onClose}
                fontSize={30}
                className="cursor-pointer mb-4 text-[var(--text)]"
              />

              {/* Avatar */}
              <div className="flex items-center justify-center mb-5">
                <img
                  src={userChat.formateChat?.image}
                  alt="user-avatar-image"
                  className="border-4 border-white w-56 h-56 rounded-full object-cover"
                />
              </div>

              {/* Name & Info */}
              <div className="flex flex-col items-center mb-5">
                <div className="block text-center">
                  <h3 className="capitalize font-manrope font-bold text-4xl mb-1">
                    {userChat.formateChat?.name}{" "}
                    <span className="text-sm">
                      {userChat.formateChat?.statusText || ""}
                    </span>
                  </h3>
                  <p className="font-normal text-base leading-7 text-center">
                    {userChat.formateChat?.email}
                    <br />
                    {userChat.formateChat?.statusQuote}
                  </p>
                </div>
              </div>

              {/* Group Members */}
              {userChat?.formateChat?.isGroupChat &&
                userChat?.formateChat?.members?.length > 0 && (
                  <>
                    <div className="flex items-center justify-center space-x-[-12px] mb-5">
                      {userChat.formateChat.members
                        .slice(0, maxVisible)
                        .map((member, index) => (
                          <div
                            key={member._id}
                            className="w-10 h-10 rounded-full border-2 border-black overflow-hidden"
                            style={{ zIndex: maxVisible - index }}
                          >
                            <img
                              src={member.avatar || "/default-avatar.png"}
                              alt={member.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      {userChat.formateChat.members.length > maxVisible && (
                        <div className="w-10 h-10 flex items-center justify-center text-[var(--text)] text-sm font-medium bg-gray-700 rounded-full border-2 border-black z-0">
                          +{userChat.formateChat.members.length - maxVisible}
                        </div>
                      )}
                      <p className="text-center ml-6">
                        <strong>
                          {userChat?.formateChat?.members?.length}
                        </strong>{" "}
                        Members
                      </p>
                    </div>
                    <h2 className="text-xl font-semibold flex items-center gap-2 justify-center">
                      <MdOutlineGroups /> Group Members
                    </h2>
                  </>
                )}

              {/* Group Members List with Admin Tag */}
              <div>
                <div>
                  {Array.isArray(userChat?.formateChat?.members) &&
                    userChat.formateChat.members.map((member) => {
                      const isAdmin = userChat.formateChat.admins.some(
                        (admin) => admin._id === member._id
                      );

                      return (
                        <div
                          key={member._id}
                          className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg w-full max-w-sm mx-auto"
                        >
                          <img
                            src={member.avatar || "default-avatar-url"} // Fallback avatar URL
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h1 className="font-semibold text-lg text-start">
                              {member.name}
                              {isAdmin && (
                                <span className="bg-[var(--badge)] ml-2 text-[var(--button-text)] text-xs py-0.5 px-2 rounded-full">
                                  Admin
                                </span>
                              )}
                            </h1>
                            <p className="text-sm text-gray-500 text-start">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>

          {/* Shared Media */}
          <h3 className="text-center underline font-bold text-2xl bg-[var(--list)] text-[var(--text)] mb-3">
            Shared Media
          </h3>

          {!userChat ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : userChat.sharedMedia?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-10 bg-[var(--list)]">
              {userChat.sharedMedia.map((media, index) => (
                <div key={index}>
                  {media.endsWith(".mp4") ? (
                    <video
                      className="h-auto max-w-full rounded-lg"
                      onClick={() => setPreviewMedia(media)}
                      controls
                      src={media}
                    />
                  ) : (
                    <img
                      className="h-auto max-w-full rounded-lg"
                      src={media}
                      onClick={() => setPreviewMedia(media)}
                      alt={`Shared media ${index + 1}`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No media shared yet.</p>
          )}
        </>
      )}
      {previewMedia && (
        <MediaViewer
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
        />
      )}
    </>
  );
};

export default ChatDrawer;
