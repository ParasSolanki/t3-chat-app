import { type ReactNode, useId } from "react";
import {
  type FieldValues,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { cn } from "~/lib/utils";

export interface UseFormFieldProps {
  name: string;
  label: string;
}

export const useFormField = <P extends UseFormFieldProps>({
  label,
  name,
  ...otherProps
}: P) => {
  const id = useId();

  return {
    formFieldProps: { id, name, label },
    childProps: { id, name, ...otherProps },
  };
};

type State = ReturnType<UseFormReturn<FieldValues>["getFieldState"]>;

interface FormFieldProps extends UseFormFieldProps {
  id: string;
  renderItem: (state: State) => ReactNode;
}

const FormField = ({ label, name, id, renderItem }: FormFieldProps) => {
  const ctx = useFormContext();
  const state = ctx.getFieldState(name, ctx.formState);

  return (
    <div>
      <label htmlFor={id} className="font-medium text-zinc-300">
        {label}
      </label>
      <div
        className={cn(
          "relative mt-1 block w-full overflow-hidden rounded-md border-2 border-neutral-700 bg-neutral-900 text-base text-slate-200 shadow-sm focus:bg-neutral-800/90 focus:outline-none focus:ring-0",
          {
            "focus-within:border-red-500": state.invalid,
            "focus-within:border-orange-400": !state.invalid,
          }
        )}
      >
        {renderItem(state)}
      </div>
      {state.error ? (
        <small className="text-red-500">{state.error.message}</small>
      ) : null}
    </div>
  );
};

export default FormField;
