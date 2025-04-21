import { isToday, isYesterday, format } from "date-fns";

// Format a date into readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// Truncate long text
export const truncate = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

// Extract time like "02:35 PM"
export const extractTime = (isoString) => {
  if (!isoString) return "Invalid time";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid time";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format timestamp used in chat preview
export const formatChatTimestamp = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  if (isToday(date)) {
    return format(date, "hh:mm a"); // e.g., "02:45 PM"
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MMM d"); // e.g., "Mar 30"
};

// Format label like "Today", "Yesterday", or full date
const formatDateLabel = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Unknown Date";
  }

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy"); // e.g., "Mar 25, 2025"
};

// Safely group messages by date
export const groupMessagesByDate = (messages = []) => {
  return messages.reduce((groups, message) => {
    if (!message?.createdAt) {
      console.warn("❗ Message missing createdAt:", message);
      return groups;
    }

    const date = new Date(message.createdAt);
    if (isNaN(date.getTime())) {
      console.warn("❗ Invalid date in message:", message.createdAt);
      return groups;
    }

    const label = formatDateLabel(date);

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(message);

    return groups;
  }, {});
};
