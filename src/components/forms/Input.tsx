import { type ComponentProps, forwardRef, useId } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "~/lib/utils";

interface Props extends ComponentProps<"input"> {
  name: string;
  label: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const form = useFormContext();
    const state = form.getFieldState(props.name, form.formState);

    console.log(form);
    return (
      <div>
        <label htmlFor={id} className="font-medium text-zinc-300">
          {label}
        </label>
        <input
          {...props}
          id={id}
          ref={ref}
          aria-invalid={state.error ? true : false}
          className={cn(
            "mt-1 block w-full rounded-md border-2 border-neutral-700 bg-neutral-900 px-3 py-2 text-base text-slate-200 shadow-sm focus:bg-neutral-800/90 focus:outline-none focus:ring-0",
            {
              "focus-within:border-red-500": state.error,
              "focus-within:border-orange-400": !state.error,
            },
            className
          )}
        />
        {state.error ? (
          <small className="text-red-500">{state.error.message}</small>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "InputElement";

export default Input;
