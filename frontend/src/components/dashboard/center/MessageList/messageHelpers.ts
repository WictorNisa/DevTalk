/**
 * Parses message text into mentions, code blocks, and plain text segments
 */
export const parseMessageContent = (text: string) => {
  const parts: Array<{
    type: "text" | "mention" | "codeblock";
    content: string;
    language?: string;
  }> = [];

  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;

  // Find all code blocks
  const codeBlocks: Array<{
    start: number;
    end: number;
    language: string;
    code: string;
  }> = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    codeBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      language: match[1] || "text",
      code: match[2],
    });
  }

  // Process code blocks and mentions
  for (let i = 0; i <= codeBlocks.length; i++) {
    const start = i === 0 ? 0 : codeBlocks[i - 1].end;
    const end = i === codeBlocks.length ? text.length : codeBlocks[i].start;

    if (i < codeBlocks.length) {
      // Process text before code block
      const beforeText = text.slice(start, end);
      parseMentions(beforeText, parts);

      // Add code block
      parts.push({
        type: "codeblock",
        content: codeBlocks[i].code,
        language: codeBlocks[i].language,
      });
    } else {
      // Process remaining text
      const remainingText = text.slice(start, end);
      parseMentions(remainingText, parts);
    }
  }

  return parts;
};

/**
 * Extracts @mentions from text and adds them to the parts array
 */
export const parseMentions = (
  text: string,
  parts: ReturnType<typeof parseMessageContent>,
) => {
  const mentionRegex = /@([\w.-]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    // Add mention
    parts.push({ type: "mention", content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
};

/**
 * Checks if the mentioned user is the current user
 */
export const isCurrentUserMentioned = (
  mentionedName: string,
  currentUser: { displayName: string } | null,
): boolean => {
  if (!currentUser) return false;
  return mentionedName === currentUser.displayName;
};
