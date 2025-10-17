import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  MessagesSquare,
  Hash,
  SquareCode,
  ShieldCheck,
  Bell,
} from "lucide-react";

export const features = [
  {
    icon: MessagesSquare,
    title: "Real-time chat",
    desc: "Fast channels and direct messages powered by WebSocket.",
  },
  {
    icon: Hash,
    title: "Threads & channels",
    desc: "Keep discussions organized by topic and team.",
  },
  {
    icon: SquareCode,
    title: "Code snippets",
    desc: "Share formatted, syntax-highlighted code directly in chat.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    desc: "Protected with Spring Security and JWT under the hood.",
  },
  {
    icon: Bell,
    title: "Mentions & notifications",
    desc: "Get notified instantly when someone mentions you or your channel.",
  },
  {
    icon: GitHubLogoIcon,
    title: "GitHub SSO",
    desc: "Seamless sign-in using your GitHub account via OAuth.",
  },
];
