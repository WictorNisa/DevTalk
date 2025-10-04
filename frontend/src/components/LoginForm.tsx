const LoginForm = () => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 text-white sm:p-6">
      <div className="w-full max-w-md">
        <div
          role="form"
          aria-label="Sign in form"
          className="flex flex-col rounded-lg bg-[var(--surface-dark)] p-6 shadow-2xl sm:p-8"
        >
          {/* Top panel*/}
          <div className="flex flex-col items-center gap-3 pb-8 sm:gap-4 sm:pb-10">
            <img
              className="w-20 rounded-lg sm:w-24"
              src="https://placehold.co/100x100"
              alt=""
            />
            <h2 className="text-4xl font-semibold sm:text-5xl">devTalk</h2>
            <span className="text-lg sm:text-xl">A DEVELOPER'S APP</span>
          </div>

          {/* Bottom panel */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center justify-center rounded-lg bg-[var(--main-bg-color)] px-4 py-3.5 transition-opacity hover:cursor-pointer hover:opacity-90 sm:px-5 sm:py-4"
              aria-label="Sign in with GitHub"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://placehold.co/40x40"
                  alt="GitHub logo"
                />
                <span className="text-base sm:text-lg">
                  Sign in with GitHub
                </span>
              </div>
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center justify-center rounded-lg bg-[var(--main-bg-color)] px-4 py-3.5 transition-opacity hover:cursor-pointer hover:opacity-90 sm:px-5 sm:py-4"
              aria-label="Sign in with GitLab"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://placehold.co/40x40"
                  alt="GitLab logo"
                />
                <span className="text-base sm:text-lg">
                  Sign in with GitLab
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
