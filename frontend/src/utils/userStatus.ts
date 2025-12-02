export const userStatus = (s?: string) => {
  const status = (s || "").toLowerCase();
  switch (status) {
    case "online":
      return "bg-green-500";
    case "idle":
      return "bg-yellow-500";
    case "busy":
      return "bg-red-500";
    default:
      return "bg-zinc-500";
  }
};
