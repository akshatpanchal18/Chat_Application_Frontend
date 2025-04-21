// ✅ Updated socketMsgListner.js
import { addNewChat, fetchChat } from "../app/slices/chatSlices";
import { addMessage, updateMessageSeen } from "../app/slices/messageSlice";
import socket from "./Socket";
import { incrementUnread } from "../app/slices/notificationSlice";
import { SOCKET_EVENTS } from "../constants/event";

export default function socketMsgListner(
  dispatch,
  my_id,
  selectedChatId,
  setTyping
) {
  if (!socket.connected) {
    console.warn("Socket is not connected. Listener not attached.");
    return () => {};
  }
  // console.log("SOCKETMSGLISTNER is CALLED!!!!!");

  socket.on(SOCKET_EVENTS.NEW_CHAT, (chat) => {
    // console.log("🔔 NEW_CHAT received from socket:", chat);

    const isGroupChat = chat?.isGroupChat;

    let shouldAdd = false;

    if (isGroupChat) {
      shouldAdd = true;
    } else {
      shouldAdd =
        chat?.otherUser_id?.toString() === my_id?.toString() ||
        chat?.createdBy?.toString() === my_id?.toString();
    }

    if (shouldAdd) {
      dispatch(addNewChat(chat));
      // dispatch(fetchChat());
      // console.log("✅ Dispatched addNewChat with:", chat);
    } else {
      console.log("🚫 Chat is not relevant for user:", my_id);
    }
  });

  socket.on(
    SOCKET_EVENTS.TYPING,
    ({ chatId: incomingChatId, userId, name }) => {
      if (incomingChatId === selectedChatId && userId !== my_id) {
        setTyping(name); // Set the name of the user typing
      }
      setTimeout(() => {
        setTyping(null);
      }, 3000);
      console.log("typing set");
    }
  );

  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ chatId: incomingChatId }) => {
    if (incomingChatId === selectedChatId) {
      setTyping(null); // Reset typing state when no one is typing
    }
  });
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message) => {
    // console.log("📨 Message received via socket:", message);
    dispatch(addMessage(message));
  });
  socket.on(SOCKET_EVENTS.MARK_MESSAGE_FOR_SEEN, (message) => {
    // console.log("recived user id:", my_id);
    const isCurrentChatOpen = selectedChatId === message.chatId;
    const userId = my_id;

    // ✅ Emit markAsSeen immediately if chat is open and user isn't the sender
    // if (isCurrentChatOpen) {
    if (isCurrentChatOpen && userId !== message.sender._id) {
      // console.log("Emitting markAsSeen for:", message._id);
      socket.emit(SOCKET_EVENTS.MARK_AS_SEEN, {
        messageId: message._id,
        chatId: message.chatId,
        userId,
      });
    }
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN_UPDATE, ({ messageId, userId }) => {
      // console.log("Seen update received:", messageId, "by", userId);
      dispatch(updateMessageSeen({ messageId, userId }));
    });
    dispatch(addMessage(message));
    // console.log("🔔 markAsSeen triggered");
    // console.log("🟢 Active Chat ID:", selectedChatId);
    // console.log("📩 Received Message Chat ID:", message.chatId);
    // console.log("👁️‍🗨️ Is Current Chat Open:", isCurrentChatOpen);
    // console.log("🙋‍♂️ Current User ID:", userId);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, ({ message, receiver }) => {
    dispatch(addMessage(message));

    const isForMe = message.chatId && message.sender._id !== my_id;

    const isSeenByMe = message.seenBy?.includes(my_id);

    if (isForMe && !isSeenByMe) {
      dispatch(incrementUnread(message.chatId)); // ✅ Increment only if not seen
    }
  });

  return () => {
    socket.off(SOCKET_EVENTS.NEW_MESSAGE);
    socket.off(SOCKET_EVENTS.MESSAGE_SEEN_UPDATE);
    socket.off(SOCKET_EVENTS.TYPING);
    socket.off(SOCKET_EVENTS.STOP_TYPING);
    socket.off(SOCKET_EVENTS.NEW_CHAT);
    // socket.off("sendNotification");
    socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED);
  };
}
