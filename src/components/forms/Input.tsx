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
            className={cn("w-full border-none bg-inherit px-3 py-2", className)}
          />
          {props?.appendicon && props.appendicon}
        </>
      )}
    ></FormField>
  );
});
Input.displayName = "InputElement";

export default Input;
