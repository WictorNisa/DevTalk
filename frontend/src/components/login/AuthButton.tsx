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
    <button
      type="button"
      onClick={() => onClick(provider)}
      className="flex items-center justify-center rounded-lg bg-(--main-bg-color) px-4 py-3.5 transition-opacity hover:cursor-pointer hover:opacity-90 sm:px-5 sm:py-4"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <img className="h-10 w-10 rounded-full" src={iconSrc} alt={iconAlt} />
        <span className="text-base sm:text-lg">{children}</span>
      </div>
    </button>
  );
};
