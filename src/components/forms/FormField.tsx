import { type ReactNode, useId } from "react";
import {
  type FieldValues,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";

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
      <div className="relative mt-1 overflow-hidden rounded-md">
        {renderItem(state)}
      </div>
      {state.error ? (
        <small className="text-red-500">{state.error.message}</small>
      ) : null}
    </div>
  );
};

export default FormField;
