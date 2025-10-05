import { AuthButton } from "@components/AuthButton";

const LoginForm = () => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 text-white sm:p-6">
      <div className="w-full max-w-md">
        <form
          role="form"
          aria-label="Sign in form"
          className="flex flex-col rounded-lg bg-[var(--surface-dark)] p-6 sm:p-8"
        >
          {/* Top panel*/}
          <div className="flex flex-col items-center gap-3 pb-8 sm:gap-4 sm:pb-10">
            <img
              className="w-20 rounded-lg sm:w-24"
              src="https://placehold.co/100x100"
              alt="devTalk logo"
            />
            <h2 className="text-4xl font-semibold sm:text-5xl">devTalk</h2>
            <span className="text-lg sm:text-xl">A DEVELOPER'S APP</span>
          </div>

          {/* Bottom panel */}
          <div className="flex flex-col gap-4">
            <AuthButton
              iconSrc="https://placehold.co/40x40"
              iconAlt="GitHub logo"
              onClick={handleSubmit}
            >
              Sign in with GitHub
            </AuthButton>
            <AuthButton
              iconSrc="https://placehold.co/40x40"
              iconAlt="GitLab logo"
              onClick={handleSubmit}
            >
              Sign in with GitLab
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
