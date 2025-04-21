import React from "react";
import { NotificationSkelaton } from "./Skelaton";
import { useDispatch, useSelector } from "react-redux";
import { extractTime } from "./Formater";

function NotificationPopup({ isLoading, offlineList, updateNotification }) {
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.notification);

  return (
    <div className="p-2 flex flex-col items-center bg-[var(--list)] rounded-2xl">
      <div
        className="max-h-64 max-w-64 min-w-64 overflow-y-auto scrollbar-width-none 
        [&::-webkit-scrollbar]:hidden p-2"
      >
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <NotificationSkelaton key={index} />
            ))}
          </>
        ) : (
          <>
            {success && <p className="text-center">{success}</p>}
            {offlineList.length > 0 ? (
              <>
                {offlineList.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-center gap-3 p-3 bg-[var(--screen)] mb-2 hover:bg-[var(--list)] transition rounded-lg"
                  >
                    <img
                      src={
                        notification?.sender?.avatar ||
                        notification?.chatId?.groupImage
                      }
                      alt={notification?.sender?.name || "group image"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text)]">
                        {notification?.sender?.name}
                      </p>
                      <p className="text-xs text-[var(--text)]">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--text)]">
                      {extractTime(notification.createdAt)}
                    </span>
                  </div>
                ))}

                {/* Show Mark as Read button only if notifications exist */}
                <div className="p-2">
                  <button
                    onClick={updateNotification}
                    className="bg-[var(--button)] text-[var(--button-text)] text-xs p-1 rounded flex items-center justify-center w-full"
                  >
                    {isLoading ? "Loading..." : "Mark all as Read"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-[var(--text)]">
                No Notifications
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationPopup;
