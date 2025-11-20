import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useChatStore } from "@/stores/chat/useChatStore";

interface MessageActionsProps {
  messageId: string;
}

export const MessageActions = ({ messageId }: MessageActionsProps) => {
  const { deleteMessage, setEditingMessage } = useChatStore();

  const handleEdit = () => {
    setEditingMessage(messageId);
  };

  const handleDelete = () => {
    deleteMessage(messageId);
    // Refresh messages after delete
    setTimeout(() => {
      const { activeChannel, loadMessages } = useChatStore.getState();
      if (activeChannel) loadMessages(activeChannel);
    }, 100);
  };

  return (
    <div
      className="invisible absolute top-0.5 right-1 flex items-center group-hover:visible"
      data-section="actions"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="bg-background hover:bg-accent text-muted-foreground hover:text-foreground rounded border p-1 shadow-sm transition-colors"
            aria-label="Message options"
            aria-haspopup="menu"
          >
            <MoreVertical className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit message
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleDelete}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
