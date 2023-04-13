import { type ComponentProps, forwardRef } from "react";
import FormField, {
  useFormField,
  type UseFormFieldProps,
} from "~/components/forms/FormField";
import { cn } from "~/lib/utils";

interface Props extends UseFormFieldProps, ComponentProps<"input"> {
  name: string;
  appendicon?: JSX.Element;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { formFieldProps, childProps } = useFormField(props);
  const { id, className, ...otherProps } = childProps;

  return (
    <FormField
      {...formFieldProps}
      renderItem={(state) => (
        <>
          <input
            id={id}
            ref={ref}
            {...otherProps}
            aria-invalid={state.invalid}
            className={cn(
              "block w-full rounded-md border-2 border-neutral-700 bg-neutral-900 px-3 py-2 text-base text-slate-200 shadow-sm focus:bg-neutral-800/90 focus:outline-none focus:ring-0",
              {
                "focus-within:border-red-500": state.invalid,
                "focus-within:border-orange-400": !state.invalid,
              },
              className
            )}
          />
          {props?.appendicon && props.appendicon}
        </>
      )}
    ></FormField>
  );
});
Input.displayName = "InputElement";

export default Input;
