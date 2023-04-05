import { type ComponentProps } from "react";
import { cn } from "~/lib/utils";

type Props = Omit<ComponentProps<"button">, "type">;

const SubmitButton = ({ className, ...props }: Props) => (
  <button
    {...props}
    type="submit"
    className={cn(
      (className =
        "highlight-white/20 rounded-lg bg-orange-400 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-orange-500/60 disabled:text-white/60"),
      className
    )}
  />
);

export default SubmitButton;
