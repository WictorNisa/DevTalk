import type { ComponentType, SVGProps } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { MessagesSquare, Hash, SquareCode, ShieldCheck, Bell } from "lucide-react";

export const FEATURE_KEYS = ["realtime", "threads", "snippets", "security", "notifications", "github"] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

type FeatureItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  key: FeatureKey;
};

export const features: FeatureItem[] = [
  {
    icon: MessagesSquare,
    key: "realtime",
  },
  {
    icon: Hash,
    key: "threads",
  },
  {
    icon: SquareCode,
    key: "snippets",
  },
  {
    icon: ShieldCheck,
    key: "security",
  },
  {
    icon: Bell,
    key: "notifications",
  },
  {
    icon: GitHubLogoIcon,
    key: "github",
  },
];
