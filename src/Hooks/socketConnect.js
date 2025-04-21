// hooks/useSocketSetup.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./Socket";
import { updateUserStatus } from "../app/slices/authSlices";
import { SOCKET_EVENTS } from "../constants/event";

const useSocketSetup = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const userData = authUser;
    if (!userData?._id) return;
    // console.log("✅ Socket connected with ID:", socket.id);

    // Emit setup on mount
    socket.emit(SOCKET_EVENTS.SETUP, userData);
    socket.on(SOCKET_EVENTS.USER_STATUS_CHANGED, ({ userId, isOnline }) => {
      // console.log("userStatusChanged set to online", userId);
      dispatch(updateUserStatus({ userId, isOnline }));
    });

    // Handle reconnects
    const handleReconnect = () => {
      // console.log("🔄 Reconnected! Re-sending setup...");
      socket.emit(SOCKET_EVENTS.SETUP, userData);
    };
    socket.on(SOCKET_EVENTS.ONLINE_USERS, (onlineUserIds) => {
      // console.log(onlineUserIds);

      onlineUserIds.forEach((id) => {
        dispatch(updateUserStatus({ userId: id, isOnline: true }));
      });
    });
    // socket.on("onlineUsers", (onlineUserIds) => {
    //   // console.log(onlineUserIds);

    //   const allUserIds = getAllChatUserIds();

    //   // Set all to offline first
    //   allUserIds.forEach((id) => {
    //     dispatch(updateUserStatus({ userId: id, isOnline: false }));
    //   });

    //   // Then mark actual online users
    //   onlineUserIds.forEach((id) => {
    //     dispatch(updateUserStatus({ userId: id, isOnline: true }));
    //   });
    // });

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
      socket.off("userStatusChanged");
      // console.log("userStatusChanged trigered");

      socket.off("onlineUsers");
    };
  }, [authUser, dispatch]);
};

export default useSocketSetup;
