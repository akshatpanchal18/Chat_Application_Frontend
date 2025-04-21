import React, { useEffect, useRef, useState } from "react";
import { HiOutlineBell, HiOutlinePlusCircle } from "react-icons/hi2";
import { ChatSvg } from "../Utils/SVG";
import { useDispatch, useSelector } from "react-redux";
import CreateChatModal from "../Utils/CreateChatPopup";
import NotificationPopup from "../Utils/NotificationPopup";
import { userLogout } from "../app/slices/authSlices";
import ProfileDrawer from "../Utils/ProfileDrawer";
import {
  getNotifications,
  updateNotification,
} from "../app/slices/notificationSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { count } = useSelector((state) => state.notification);
  const { offlineList, isLoading } = useSelector((state) => state.notification);
  // console.log(authUser);
  const [showModal, setShowModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showprofile, setShowProfile] = useState(false);
  const notificationRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  const handleMarkasRead = () => {
    dispatch(updateNotification());
    dispatch(getNotifications());
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of the modal
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationModal(false); // Call the passed closeModal function to close the modal
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false); // Call the passed closeModal function to close the modal
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationModal, showprofile]);

  return (
    <div className=" relative flex justify-between items-center bg-[var(--nav)] w-full h-full px-4 py-2">
      {/* Left: Logo / App Name */}
      <h1 className="flex items-center gap-4 text-xl font-semibold text-[var(--logo)]">
        <ChatSvg
          height={50}
          width={50}
          logo="var(--logo)"
          logoLight="var(--logoLight)"
        />
        Talksy
      </h1>

      {/* Right: Create Chat, Notification Bell, Avatar */}
      <div className="flex flex-row-reverse items-center gap-4">
        <button
          onClick={() => setShowModal(!showModal)}
          className=" sm:flex items-center gap-2 bg-[var(--button)] hover:bg-[var(--button-hover)] text-[var(--button-text)] px-4 py-2 rounded-lg transition"
        >
          <HiOutlinePlusCircle className="text-xl" />
          <span className="hidden sm:inline">Create Chat</span>
        </button>

        {/* Notification Bell with Badge */}
        <div
          className="relative"
          onClick={() => setShowNotificationModal(!showNotificationModal)}
        >
          <HiOutlineBell
            fontSize={35}
            className=" text-[var(--icon)] cursor-pointe transition"
          />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-[var(--badge)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {count}
            </span>
          )}
        </div>

        {/* User Avatar */}
        <img
          onClick={() => setShowProfile(!showprofile)}
          src={authUser?.avatar}
          // src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-[var(--button)]"
        />
        <p className="text-[var(--logo)] capitalize">{authUser?.name}</p>
      </div>

      {showModal && <CreateChatModal onClose={() => setShowModal(false)} />}
      {showNotificationModal && (
        <div
          ref={notificationRef}
          className="absolute top-16 right-4 z-50 rounded-2xl"
        >
          <NotificationPopup
            isLoading={isLoading}
            offlineList={offlineList}
            updateNotification={handleMarkasRead}
          />
        </div>
      )}
      {showprofile && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-end">
          <div
            ref={profileRef}
            className="w-full sm:w-96 h-full bg-white shadow-lg overflow-y-auto transition-transform transform translate-x-0"
          >
            <ProfileDrawer
              user={authUser}
              onClose={() => setShowProfile(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
