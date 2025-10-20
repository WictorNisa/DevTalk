import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpIcon, PlusIcon } from "lucide-react";

const CenterBottomWidget = () => {
  return (
    <InputGroup>
      <InputGroupTextarea
        className="content- min-h-21"
        placeholder="Type your message here..."
      />
      <InputGroupAddon align="block-end">
        {/* Add Icon */}
        <InputGroupButton
          variant="outline"
          className="rounded-full"
          size="icon-xs"
        >
          <PlusIcon />
        </InputGroupButton>
        {/* Drop Down */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant="ghost">Auto</InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="[--radius:0.95rem]"
          >
            <DropdownMenuItem>Auto</DropdownMenuItem>
            <DropdownMenuItem>Agent</DropdownMenuItem>
            <DropdownMenuItem>Manual</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Send Button */}
        <InputGroupButton
          variant="default"
          className="rounded-full"
          size="icon-xs"
          disabled
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default CenterBottomWidget;
