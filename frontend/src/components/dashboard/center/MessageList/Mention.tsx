interface MentionProps {
  content: string;
  isMentioned: boolean;
}

export const Mention: React.FC<MentionProps> = ({ content, isMentioned }) => {
  const handleClick = () => {
    console.log("Mention clicked:", content);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`cursor-pointer font-semibold hover:underline ${
        isMentioned
          ? "rounded-sm bg-indigo-800/80 p-0.5 px-1.5"
          : "text-indigo-500/95"
      }`}
    >
      @{content}
    </span>
  );
};
