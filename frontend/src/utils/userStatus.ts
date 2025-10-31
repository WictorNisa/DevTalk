export const userStatus = (s?: string) => {
  const status = (s || "").toLowerCase();
  switch (status) {
    case "online":
      return "bg-green-400";
    case "idle":
      return "bg-yellow-400";
    case "busy":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};
