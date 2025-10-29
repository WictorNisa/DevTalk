import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  // InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SmilePlus, PlusIcon, SendHorizontal, FileUp } from "lucide-react";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useState } from "react";

const CenterBottomWidget = () => {
  const { sendMessage } = useSendMessage();
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage({
        text: inputValue,
        user: "CurrentUser",
        avatar: "Mullebäck",
      });
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="grid w-full" onSubmit={handleSubmit}>
      <InputGroup className="rounded-xl">
        <InputGroupTextarea
          className="min-h-auto"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          typeof="button"
        />
        <InputGroupAddon align="block-end" className="ml-auto border-t">
          {/* Drop Down */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="outline"
                className="cursor-pointer rounded-full"
                size="icon-xs"
              >
                <PlusIcon />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="hidden w-48 md:block"
            >
              <DropdownMenuItem className="cursor-pointer">
                <FileUp />
                Upload File
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Test
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Test
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Send Button */}
          <InputGroupButton
            variant="ghost"
            className="ml-auto cursor-pointer rounded-full"
            size="icon-xs"
          >
            <SmilePlus />
          </InputGroupButton>
          <InputGroupButton
            variant="ghost"
            className="cursor-pointer rounded-full"
            size="icon-xs"
            onClick={handleSubmit}
          >
            <SendHorizontal />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default CenterBottomWidget;
