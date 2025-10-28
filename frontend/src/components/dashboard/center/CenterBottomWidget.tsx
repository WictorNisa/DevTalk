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

const CenterBottomWidget = () => {
  return (
    <div className="grid w-full">
      <InputGroup className="rounded-xl">
        <InputGroupTextarea
          className="min-h-auto"
          placeholder="Type your message here..."
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
          >
            <SendHorizontal />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default CenterBottomWidget;
