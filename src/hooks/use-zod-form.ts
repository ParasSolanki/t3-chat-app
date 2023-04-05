import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TypeOf, ZodSchema } from "zod";

interface UseZodFormProps<Z extends ZodSchema>
  extends Exclude<UseFormProps<TypeOf<Z>>, "resolver"> {
  schema: Z;
}

const useZodForm = <Z extends ZodSchema>({
  schema,
  ...formProps
}: UseZodFormProps<Z>) =>
  useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });

export default useZodForm;
