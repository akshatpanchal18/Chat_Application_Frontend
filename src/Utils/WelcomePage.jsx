// components/ChatIntro.tsx
import { BsChatDots } from "react-icons/bs";
import { IoChatbubblesOutline } from "react-icons/io5";
import { ChatSvg } from "./SVG";

const ChatIntro = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* <img
        src="/whatsapp-placeholder.svg" // Replace with your own logo or image
        alt="ChatSphere"
        className="w-32 h-32 mb-6 opacity-80"
      /> */}
      {/* <BsChatDots className="text-indigo-500 mb-6" size={64} /> */}
      {/* <IoChatbubblesOutline className="text-indigo-500 w-20 h-20 mb-6" /> */}
      <ChatSvg logo="var(--logo)" logoLight="var(--logoLight)" />

      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Welcome to Talksy
      </h2>
      <p className="text-gray-500 max-w-md">
        Select a conversation , or create a new chat to get started. All your
        messages will appear here.
      </p>
    </div>
  );
};

export default ChatIntro;
