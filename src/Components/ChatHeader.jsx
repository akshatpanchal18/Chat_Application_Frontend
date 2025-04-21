import { IoArrowBackSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { extractTime } from "../Utils/Formater";
import { useDispatch, useSelector } from "react-redux";
import { unSetChatId } from "../app/slices/chatSlices";

const ChatHeader = ({ chatData, onBack, chatAbout }) => {
  const onlineStatus = useSelector((state) => state.auth.onlineStatus);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const my_id = authUser?._id;

  // console.log(chatData);
  // console.log(authUser);

  let otherUserName;
  let otherUserAvatar;
  let otherUserUpdatedAt;
  let otheruserId;
  if (chatData?.createdBy?._id === my_id) {
    otherUserName = chatData?.members[0]?.name;
    otherUserAvatar = chatData?.members[0]?.avatar;
    otherUserUpdatedAt = chatData?.members[0]?.updatedAt;
    otheruserId = chatData?.members[0]?._id;
  } else {
    otherUserName = chatData?.createdBy?.name;
    otherUserAvatar = chatData?.createdBy?.avatar;
    otherUserUpdatedAt = chatData?.createdBy?.updatedAt;
    otheruserId = chatData?.createdBy?._id;
  }
  const isOnline = onlineStatus[otheruserId] || false;
  const handleRemoveChatId = () => {
    dispatch(unSetChatId(chatData?._id));
  };
  return (
    <>
      <div className=" relative w-full h-16 px-4 flex items-center justify-between border-b bg-[var(--list)] shadow-sm rounded">
        {/* Left Side: Back + Avatar + Info */}
        <div className="flex items-center gap-3">
          <button className="" onClick={handleRemoveChatId}>
            <IoArrowBackSharp className="text-2xl text-[var(--text)]" />
          </button>

          <div onClick={chatAbout} className="flex items-center gap-3">
            {chatData?.isGroupChat ? (
              <>
                <img
                  src={
                    chatData?.groupImage ||
                    `https://ui-avatars.com/api/?background=0D8ABC&color=ffffff&name=${chatData?.groupName}`
                  }
                  alt={chatData?.groupName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="font-medium text-[var(--text)]">
                    {chatData?.groupName}
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    {chatData?.members?.length + 1} members
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={otherUserAvatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="font-medium text-[var(--text)] capitalize">
                    {otherUserName}
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    {isOnline
                      ? "Online"
                      : `last seen ${extractTime(otherUserUpdatedAt)}`}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: 3-dot menu */}
        <button
          // onClick={() => setShowPopup(!showPopup)}
          className="text-[var(--text)]"
        >
          <BsThreeDotsVertical className="text-xl" />
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
