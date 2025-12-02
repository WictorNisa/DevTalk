import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

// Placeholder for now, Future implementation.
export const MsgSearch = () => {
  return (
    <div className="absolute top-5 right-6 z-100 flex items-center">
      <MagnifyingGlassIcon className="text-ring relative left-6.5" />
      <input
        type="search"
        name=""
        id=""
        className="border-foreground/10 bg-background/65 focus:border-foreground/30 relative box-border w-80 rounded-md border px-2 py-1 pl-8 font-light focus:outline-none"
        placeholder="Search..."
      />
    </div>
  );
};
