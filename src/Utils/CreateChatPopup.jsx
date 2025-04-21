import { useEffect, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { SlClose } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { usersList } from "../app/slices/userSlice";
import { createChat } from "../app/slices/chatSlices";

const CreateChatModal = ({ onClose }) => {
  const [chatType, setChatType] = useState("personal");
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [members, setMembers] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(usersList({ query: search }));
  }, [dispatch, search]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUserClick = async (user) => {
    if (chatType === "personal") {
      // Allow only one person for personal chat
      setMembers([user]);
    } else {
      if (members.some((u) => u._id === user._id)) return;
      setMembers((prev) => [...prev, user]);
    }
  };

  const handleRemoveMember = (_id) => {
    setMembers((prev) => prev.filter((u) => u._id !== _id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (chatType === "group") {
        const userIds = members.map((user) => user._id);
        const payload = {
          userIds,
          isGroupChat: true,
          chatName: groupName,
          description: groupDesc,
          groupImg: image,
        };
        dispatch(createChat(payload));
        console.log("Group Chat Payload:", payload);
      } else {
        const payload = {
          userIds: members.map((user) => user._id),
        };
        dispatch(createChat(payload));
        console.log("Personal Chat Payload:", payload);
      }

      onClose();
    } catch (err) {
      console.error("Chat creation error:", err);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-40 z-50 p-4 flex justify-center items-center">
      <div className="bg-[var(--list)] rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[var(--text)]">
            Create Chat
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text)] hover:text-red-500 text-xl"
          >
            <SlClose fontSize={25} />
          </button>
        </div>

        {/* Chat Type Selection */}
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="chatType"
              value="personal"
              checked={chatType === "personal"}
              onChange={() => setChatType("personal")}
              className="appearance-none checked:bg-[var(--badge)] checked:border-transparent border-2 border-[var(--badge)] rounded-full w-4 h-4"
            />
            <span className="text-sm font-medium text-[var(--text)]">
              One-to-One
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="chatType"
              value="group"
              checked={chatType === "group"}
              onChange={() => setChatType("group")}
              className="appearance-none checked:bg-[var(--badge)] checked:border-transparent border-2 border-[var(--badge)] rounded-full w-4 h-4"
            />
            <span className="text-sm font-medium text-[var(--text)]">
              Group Chat
            </span>
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: Image Upload (only for group) */}
          {chatType === "group" && (
            <div className="md:w-1/3 w-full h-full flex flex-col items-center justify-center">
              {preview ? (
                <div className="relative w-full h-full">
                  <p className="text-sm text-[var(--text)] mb-1">Preview:</p>
                  <button
                    className="absolute top-0 right-0 text-[var(--text)] hover:text-red-500"
                    onClick={() => {
                      setPreview(null);
                      setImage(null);
                    }}
                  >
                    <SlClose size={18} />
                  </button>
                  <img
                    src={preview}
                    alt="Group preview"
                    className="h-full max-h-28 w-full rounded object-contain border"
                  />
                </div>
              ) : (
                <label className="cursor-pointer w-full border border-dashed bg-white border-gray-400 px-4 py-10 rounded-lg text-center text-[var(--text)] hover:bg-gray-100 transition">
                  <span className="flex flex-col items-center justify-center gap-2 font-medium">
                    <LuImagePlus fontSize={25} />
                    Upload group image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {/* Selected Members */}
              {chatType === "group" && members.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-[var(--text)]">
                    Added Members:
                  </h3>
                  <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[160px]">
                    {members.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-2 px-3 py-1 bg-white rounded-full"
                      >
                        <img
                          src={user.avatar}
                          className="w-6 h-6 rounded-full"
                          alt={user.name}
                        />
                        <span className="text-sm">{user.name}</span>
                        <button
                          onClick={() => handleRemoveMember(user._id)}
                          className="text-xs text-red-500 cursor-pointer"
                        >
                          <SlClose size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right side: Form */}
          <div className="flex-1">
            {chatType === "group" && (
              <div className="flex gap-6 mb-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  className="border w-1/2 px-3 py-2 rounded placeholder:text-[var(--text)] text-[var(--text)]"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="border w-1/2 px-3 py-2 rounded placeholder:text-[var(--text)] text-[var(--text)]"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                />
              </div>
            )}

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded placeholder:text-[var(--text)] text-[var(--text)]"
            />

            {/* User List */}
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {chatType === "personal" && members.length === 1 ? (
                <>
                  {members.map((m) => (
                    <div key={m._id} className="flex items-center gap-4">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-[var(--text)]">
                        {m.name}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {userList.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center gap-4 cursor-pointer hover:bg-[var(--screen)] p-2 rounded"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-[var(--text)]">
                        {user.name}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[var(--button)] hover:bg-[var(--button-hover)] text-[var(--text)] py-2 rounded"
            >
              {chatType === "group" ? "Create Group" : "Start Chat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
