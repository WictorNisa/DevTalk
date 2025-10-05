import { AuthButton } from "@components/AuthButton";

const LoginForm = () => {
  const handleAuthProvider = (provider: "github" | "gitlab") => {
    // TODO: Implement actual auth logic here
    console.log(`Authenticating with ${provider}`);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 text-white sm:p-6">
      <div className="w-full max-w-md">
        <div
          role="region"
          aria-label="Authentication options"
          className="flex flex-col rounded-lg bg-[var(--surface-dark)] p-6 sm:p-8"
        >
          {/* Top panel*/}
          <div className="flex flex-col items-center gap-3 pb-8 sm:gap-4 sm:pb-10">
            <img
              className="w-20 rounded-lg sm:w-24"
              src="https://placehold.co/100x100"
              alt="devTalk logo"
            />
            <h1 className="text-4xl font-semibold sm:text-5xl">devTalk</h1>
            <span className="text-lg sm:text-xl">A DEVELOPER'S APP</span>
          </div>

          {/* Authentication options */}
          <div className="flex flex-col gap-4">
            <AuthButton
              iconSrc="https://placehold.co/40x40"
              iconAlt="GitHub logo"
              provider="github"
              onClick={handleAuthProvider}
            >
              Sign in with GitHub
            </AuthButton>
            <AuthButton
              iconSrc="https://placehold.co/40x40"
              iconAlt="GitLab logo"
              provider="gitlab"
              onClick={handleAuthProvider}
            >
              Sign in with GitLab
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
