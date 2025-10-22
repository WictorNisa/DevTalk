export interface UserCardProps { 
    avatar: string;
    username: string;
    isOnline: boolean;
    status: "Online" | "Idle" | "Busy" | "Offline";
}