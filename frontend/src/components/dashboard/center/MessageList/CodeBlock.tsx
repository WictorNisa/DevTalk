import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  part: {
    content: string;
    language?: string;
  };
  index: number;
  copiedIndex: number | null;
  onCopy: (content: string, index: number) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  part,
  index,
  copiedIndex,
  onCopy,
}) => {
  const isCopied = copiedIndex === index;

  return (
    <pre className="bg-muted relative my-1 overflow-x-auto rounded p-2">
      <div className="absolute top-1 right-2 flex items-center gap-2">
        {part.language && (
          <span className="text-muted-foreground bg-background rounded px-2 py-0.5 text-xs">
            {part.language}
          </span>
        )}
        <button
          onClick={() => onCopy(part.content, index)}
          className="bg-background hover:bg-accent text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={part.language || "text"}
        style={dracula}
        PreTag="div"
        customStyle={{
          fontSize: "12px",
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
        codeTagProps={{ style: { fontSize: "12px" } }}
      >
        {part.content}
      </SyntaxHighlighter>
    </pre>
  );
};
