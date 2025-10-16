import { AuthButton } from "@/components/login/AuthButton";
import Card from "../ui/Card";
import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";

const LoginForm = () => {
  const handleAuthProvider = (provider: "github" | "gitlab") => {
    // TODO: Implement actual auth logic here
    console.log(`Authenticating with ${provider}`);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="h-1/2 w-1/5 items-center p-10">
        <div role="region" aria-label="Authentication options">
          {/* Top panel*/}
          <div className="flex flex-col items-center gap-3 pb-8 sm:gap-4 sm:pb-10">
            <DevTalkLogo className="h-full" />
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
