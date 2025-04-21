import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaSignOutAlt, FaPaintBrush } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../app/slices/themeSlice"; // update path
import { userLogout } from "../app/slices/authSlices";

const themes = [
  { name: "Dark", value: "theme-plate1" },
  { name: "Light", value: "theme-plate2" },
  { name: "Neon-Dark", value: "theme-plate3" },
  // { name: "neon-light", value: "theme-plate4" },
];

const ProfileDrawer = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.theme);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  const handleLogout = () => {
    // console.log("Logout button clicked! Dispatching userLogout...");
    dispatch(userLogout());
  };

  const handleThemeClick = () => {
    setShowThemeDrawer(true);
  };

  const handleSelectTheme = (themeValue) => {
    dispatch(setTheme(themeValue));
    setShowThemeDrawer(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getThemeStyles = (theme) => {
    return {
      "--button":
        theme === "theme-plate1"
          ? "#1f2937"
          : theme === "theme-plate2"
          ? "#4338CA"
          : "#7f00ff",
      "--button-text": "#ffffff",
      "--button-hover":
        theme === "theme-plate1"
          ? "#374151"
          : theme === "theme-plate2"
          ? "#3730A3"
          : "#9d4edd",
      "--message-receiver":
        theme === "theme-plate1"
          ? "#2c2f36"
          : theme === "theme-plate2"
          ? "#E0E7FF"
          : "#0f172a",
      "--receiver-text":
        theme === "theme-plate1"
          ? "#e5e7eb"
          : theme === "theme-plate2"
          ? "#0a0a0a"
          : "#7dd3fc",
      "--message-sender":
        theme === "theme-plate1"
          ? "#1f2937"
          : theme === "theme-plate2"
          ? "#6366F1"
          : "#7f00ff",
      "--sender-text": "#ffffff",
      "--icon":
        theme === "theme-plate1"
          ? "#4b5563"
          : theme === "theme-plate2"
          ? "#4F46E5"
          : "#facc15",
      "--list":
        theme === "theme-plate1"
          ? "#374151"
          : theme === "theme-plate2"
          ? "#EEF2FF"
          : "#1e293b",
      "--nav":
        theme === "theme-plate1"
          ? "#111827"
          : theme === "theme-plate2"
          ? "#EEF2FF"
          : "#0f172a",
      "--badge":
        theme === "theme-plate1"
          ? "#ef4444"
          : theme === "theme-plate2"
          ? "#4338CA"
          : "#f43f5e",
      "--screen":
        theme === "theme-plate1"
          ? "#1a1a1a"
          : theme === "theme-plate2"
          ? "#ffffff"
          : "#0a0a0a",
      "--skelaton":
        theme === "theme-plate1"
          ? "#2c2f36"
          : theme === "theme-plate2"
          ? "#c7d2fe"
          : "#334155",
    };
  };

  return (
    <>
      {/* Main Profile Drawer */}
      <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[var(--screen)] z-50 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <button onClick={onClose} className="text-[var(--text)]">
            <IoArrowBack size={24} />
          </button>
          <h2 className="ml-4 text-lg font-semibold text-[var(--text)]">
            Profile
          </h2>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center p-6">
          <img
            src={user?.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h3 className="text-xl font-semibold text-[var(--text)]">
            {user?.name || "John Doe"}
          </h3>
          <p className="text-[var(--text)]">
            {user?.email || "john@example.com"}
          </p>

          <p className="mt-4 text-sm text-[var(--text)]">
            <span className="font-medium">Status: </span>
            {user?.statusText || "Hey there!"}
          </p>

          <p className="mt-2 italic text-[var(--text)] text-center px-4">
            "{user?.statusQuote || "Stay positive!"}"
          </p>

          <p className="mt-4 text-xs text-[var(--text)]">
            Joined on:{" "}
            {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 p-4 mt-auto">
          <button
            onClick={handleThemeClick}
            className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-3 rounded-lg"
          >
            <FaPaintBrush />
            Change Theme
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-3 rounded-lg"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {showThemeDrawer && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 z-50 flex items-end">
          <div className="w-full bg-[var(--screen)] rounded-t-2xl p-6 overflow-y-auto max-h-[97vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Select Theme
              </h3>
              <button onClick={() => setShowThemeDrawer(false)}>
                <IoClose size={24} className="text-[var(--text)]" />
              </button>
            </div>

            {/* Theme Options */}
            <div className="flex flex-col gap-6">
              {themes.map((theme) => {
                const isActive = theme.value === currentTheme;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleSelectTheme(theme.value)}
                    className={`flex flex-col items-center gap-3 rounded-lg p-2 transition ${
                      isActive
                        ? "border-2 border-indigo-500 bg-[var(--list)]"
                        : "hover:bg-[var(--nav)]"
                    }`}
                    style={getThemeStyles(theme.value)}
                  >
                    {/* Preview Box */}
                    <div className="w-full h-36 rounded bg-[var(--screen)] flex flex-col p-1 gap-1 relative">
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 text-xs">
                          ✓
                        </div>
                      )}
                      <div className="h-4 w-full bg-[var(--nav)] rounded mb-1"></div>
                      <div className="flex items-center gap-1 w-full flex-1">
                        <div className="w-10 h-full rounded bg-[var(--list)]"></div>
                        <div className="flex flex-col w-full h-full p-1 gap-1 justify-between">
                          <div className="h-3 w-2/3 bg-[var(--message-receiver)] rounded self-start"></div>
                          <div className="h-3 w-7 bg-[var(--message-sender)] rounded self-end"></div>
                          <div className="h-3 w-12 bg-[var(--message-receiver)] rounded self-start"></div>
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 bg-[var(--button)] rounded mt-auto"></div>
                            <div className="h-4 w-full bg-[var(--list)] rounded mt-auto"></div>
                            <div className="h-4 w-6 bg-[var(--button)] rounded mt-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Theme Name */}
                    <span className="text-sm font-medium text-gray-700">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDrawer;
