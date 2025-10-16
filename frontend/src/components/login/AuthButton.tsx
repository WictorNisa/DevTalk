// components/auth/AuthButton.tsx
import { Button } from "@components/ui/Button";

type AuthProvider = "github" | "gitlab";

interface AuthButtonProps {
  children: React.ReactNode;
  iconSrc: string;
  iconAlt: string;
  provider: AuthProvider;
  onClick: (provider: AuthProvider) => void;
}

export const AuthButton = ({
  children,
  iconSrc,
  iconAlt,
  provider,
  onClick,
}: AuthButtonProps) => {
  return (
    <Button type="button" onClick={() => onClick(provider)}>
      <div className="flex items-center gap-3 sm:gap-4">
        <img className="h-10 w-10 rounded-full" src={iconSrc} alt={iconAlt} />
        <span>{children}</span>
      </div>
    </Button>
  );
};
