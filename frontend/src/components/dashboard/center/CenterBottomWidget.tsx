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
import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";

const CenterBottomWidget = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const sendMessage = useChatStore((state) => state.sendMessage);
  const activeChannel = useChatStore((state) => state.activeChannel);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!user) {
    //   console.error("User not authed");
    //   return;
    // }
    if (inputValue.trim() && activeChannel) {
      console.log("Sending message... from", user.displayName);
      sendMessage(activeChannel, inputValue.trim());
      setInputValue("");
    } else {
      console.log("Cannot send - missing channel or empty input");
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
      <InputGroup className="rounded-lg">
        <InputGroupTextarea
          className="min-h-auto"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
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
