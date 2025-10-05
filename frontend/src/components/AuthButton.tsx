interface AuthButtonProps {
  children: React.ReactNode;
  iconSrc: string;
  iconAlt: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AuthButton = ({
  children,
  iconSrc,
  iconAlt,
  onClick,
}: AuthButtonProps) => {
  return (
    <button
      type="submit"
      // TODO:  Add actual function
      onClick={onClick}
      className="flex items-center justify-center rounded-lg bg-[var(--main-bg-color)] px-4 py-3.5 transition-opacity hover:cursor-pointer hover:opacity-90 sm:px-5 sm:py-4"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <img className="h-10 w-10 rounded-full" src={iconSrc} alt={iconAlt} />
        <span className="text-base sm:text-lg">{children}</span>
      </div>
    </button>
  );
};
