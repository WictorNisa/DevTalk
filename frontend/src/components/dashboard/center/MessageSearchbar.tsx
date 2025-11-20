import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";

type SearchResult = {
  id: string;
  content: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  channelId: number;
  timestamp: number;
};

const MessageSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { stompClient, connected, switchChannel, activeChannel } =
    useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!stompClient || !connected || !user) {
      console.log("Search subscription not ready:", {
        hasStompClient: !!stompClient,
        connected,
        hasUser: !!user,
      });
      return;
    }

    console.log("Setting up search subscription for user:", user.displayName);

    const subscription = stompClient.subscribe(
      "/user/queue/search",
      (message) => {
        console.log("Search results received:", message.body);
        try {
          const results = JSON.parse(message.body);
          console.log("Parsed search results:", results);
          setSearchResults(results);
          setIsSearching(false);
          setShowResults(true);
        } catch (error) {
          console.error("Error parsing search results:", error);
          setIsSearching(false);
        }
      },
    );

    console.log("Search subscription created");

    return () => {
      console.log("Unsubscribing from search");
      subscription.unsubscribe();
    };
  }, [stompClient, connected, user]);

  const handleSearch = useCallback(() => {
    console.log("Search triggered:", {
      searchQuery,
      hasStompClient: !!stompClient,
      connected,
      user: user?.displayName,
    });

    if (!searchQuery.trim()) {
      console.log("Search cancelled: empty query");
      return;
    }

    if (!stompClient) {
      console.log("Search cancelled: no stompClient");
      return;
    }

    if (!connected) {
      console.log("Search cancelled: not connected");
      return;
    }

    console.log("Publishing search request...");
    setIsSearching(true);

    try {
      stompClient.publish({
        destination: "/app/message.search",
        body: JSON.stringify({
          content: searchQuery.trim(),
        }),
      });
      console.log("Search request published successfully");
    } catch (error) {
      console.error("Error publishing search:", error);
      setIsSearching(false);
    }
  }, [searchQuery, stompClient, connected, user]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log("Navigating to message:", result);

    const targetChannel = result.channelId.toString();
    if (activeChannel !== targetChannel) {
      console.log(
        `Switching from channel ${activeChannel} to ${targetChannel}`,
      );
      switchChannel(targetChannel);
    }

    setHighlightedMessageId(result.id);
    setTimeout(() => setHighlightedMessageId(null), 3000);

    setShowResults(false);

    setTimeout(
      () => {
        const messageElement = document.getElementById(`message-${result.id}`);
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          messageElement.classList.add("highlight-message");
          setTimeout(
            () => messageElement.classList.remove("highlight-message"),
            3000,
          );
        } else {
          console.warn(`Message element not found: message-${result.id}`);
        }
      },
      activeChannel !== targetChannel ? 500 : 100,
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10 pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} size="sm">
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {showResults && (
        <div className="bg-background border-border absolute top-full right-0 left-0 z-50 max-h-96 overflow-y-auto border-x border-b shadow-lg">
          {searchResults.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center text-sm">
              No messages found
            </div>
          ) : (
            <div className="divide-y">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="hover:bg-accent cursor-pointer p-4 transition-colors"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={result.senderAvatarUrl}
                        alt={result.senderDisplayName}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm font-semibold">
                        {result.senderDisplayName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Channel #{result.channelId}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formatTimestamp(result.timestamp)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm">
                    {highlightMatch(result.content, searchQuery)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageSearchBar;
