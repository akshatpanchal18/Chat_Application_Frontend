export const ChatListSkelaton = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-6 rounded-xl bg-gray-100 p-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-400 "></div>
          <div className="flex flex-col items-start gap-4">
            <div className="h-3 w-10 bg-gray-400 rounded"></div>
            <div className="h-3 w-28 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="h-3 w-13 bg-gray-400 flex items-end justify-end rounded"></div>
      </div>
    </>
  );
};

export const NotificationSkelaton = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-3 w-10 bg-gray-400 rounded"></div>
            <div className="h-3 w-24 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="h-3 w-12 bg-gray-400 rounded"></div>
      </div>
    </>
  );
};
export const ChatSkelaton = () => {
  return <></>;
};
