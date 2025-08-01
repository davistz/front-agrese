import { useTheme } from "../contexts/ThemeContext";

export const useThemeColors = () => {
  const { theme } = useTheme();

  const colors = {
    background: {
      primary: theme === "dark" ? "bg-gray-900" : "bg-white",
      secondary: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
      card: theme === "dark" ? "bg-gray-800" : "bg-white",
      hover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
    },
    text: {
      primary: theme === "dark" ? "text-white" : "text-gray-900",
      secondary: theme === "dark" ? "text-gray-300" : "text-gray-600",
      muted: theme === "dark" ? "text-gray-400" : "text-gray-500",
    },
    border: {
      primary: theme === "dark" ? "border-gray-700" : "border-gray-200",
      secondary: theme === "dark" ? "border-gray-600" : "border-gray-300",
    },
    input: {
      background: theme === "dark" ? "bg-gray-700" : "bg-white",
      border: theme === "dark" ? "border-gray-600" : "border-gray-300",
      text: theme === "dark" ? "text-white" : "text-gray-900",
      placeholder:
        theme === "dark" ? "placeholder-gray-400" : "placeholder-gray-500",
    },
    badge: {
      admin:
        theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800",
      manager:
        theme === "dark"
          ? "bg-blue-900 text-blue-300"
          : "bg-blue-100 text-blue-800",
      collaborator:
        theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800",
      itAdmin:
        theme === "dark"
          ? "bg-purple-900 text-purple-300"
          : "bg-purple-100 text-purple-800",
      active:
        theme === "dark"
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800",
      inactive:
        theme === "dark"
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800",
    },
    stats: {
      blue:
        theme === "dark"
          ? "bg-gradient-to-br from-blue-900 to-blue-800"
          : "bg-gradient-to-br from-blue-50 to-blue-100",
      green:
        theme === "dark"
          ? "bg-gradient-to-br from-green-900 to-green-800"
          : "bg-gradient-to-br from-green-50 to-green-100",
      red:
        theme === "dark"
          ? "bg-gradient-to-br from-red-900 to-red-800"
          : "bg-gradient-to-br from-red-50 to-red-100",
      purple:
        theme === "dark"
          ? "bg-gradient-to-br from-purple-900 to-purple-800"
          : "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    statsText: {
      blue: theme === "dark" ? "text-blue-300" : "text-blue-600",
      blueSecondary: theme === "dark" ? "text-blue-200" : "text-blue-700",
      green: theme === "dark" ? "text-green-300" : "text-green-600",
      greenSecondary: theme === "dark" ? "text-green-200" : "text-green-700",
      red: theme === "dark" ? "text-red-300" : "text-red-600",
      redSecondary: theme === "dark" ? "text-red-200" : "text-red-700",
      purple: theme === "dark" ? "text-purple-300" : "text-purple-600",
      purpleSecondary: theme === "dark" ? "text-purple-200" : "text-purple-700",
    },
  };

  return { theme, colors };
};
