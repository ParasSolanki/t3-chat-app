import { type ComponentProps } from "react";
import {
  type UseFormReturn,
  type FieldValues,
  type SubmitHandler,
  FormProvider,
} from "react-hook-form";

interface Props<T extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

// Copied from https://www.brendonovich.dev/blog/the-ultimate-form-abstraction
// Thanks to @brendonovich

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
      </form>
    </FormProvider>
  );
};

export default Form;
