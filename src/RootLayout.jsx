import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ChatList from "./components/ChatList";
import ChatIntro from "./Utils/WelcomePage";
import useSocketSetup from "./Hooks/socketConnect";
import socketMsgListner from "./Hooks/socketMsgListner";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";

const RootLayout = () => {
  // const [selectedChatId, setSelectedChatId] = useState("");
  const [typing, setTyping] = useState("");
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.theme);
  const { selectedChatId } = useSelector((state) => state.chat);
  const my_id = authUser?._id;
  useSocketSetup();

  useEffect(() => {
    // console.log("sended chatID in socket:", selectedChatId);
    socketMsgListner(dispatch, my_id, selectedChatId, setTyping);
  }, [dispatch, selectedChatId, my_id, setTyping]);
  return (
    <div className={`${currentTheme} h-screen w-screen flex flex-col`}>
      {/* Header Section */}
      <header
        className={`h-16 sm:block ${selectedChatId ? "hidden" : "block"}`}
      >
        <Header />
      </header>

      {/* Flex container for Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden bg-[var(--screen)]">
        {/* Sidebar / Chat List */}
        <aside
          className={`lg:max-w-1/4 w-full p-4 lg:block ${
            selectedChatId ? "hidden" : "block"
          }`}
          // style={{ flexBasis: "25%" }} // Ensure the sidebar takes 25% width when visible
        >
          <ChatList />
        </aside>

        {/* Main Chat Screen (Only visible when a chat is selected) */}
        <main className={`flex-1 overflow-y-auto `}>
          {selectedChatId ? (
            <Outlet context={{ selectedChatId, typing }} />
          ) : (
            <div className="hidden lg:block h-full">
              <ChatIntro />
            </div>
          )}
        </main>

        {/* <main className="flex-1 overflow-y-auto">
          {!selectedChatId && (
            <div className="hidden lg:flex h-full items-center justify-center">
              <ChatIntro />
            </div>
          )}

          {selectedChatId && (
            <div className="h-full bg-white">
              <Outlet context={{ selectedChatId }} />
            </div>
          )}
        </main> */}
      </div>
    </div>
  );
};

export default RootLayout;
