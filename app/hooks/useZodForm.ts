import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function useZodForm<T extends z.ZodType<any, any, any>>(
  schema: T,
  props?: UseFormProps<z.infer<T>>,
): {
  form: UseFormReturn<z.infer<T>>;
} {
  type FormType = z.infer<typeof schema>;

  const form = useForm<FormType>({
    resolver: zodResolver(schema as z.ZodType<FormType, any, any>),
    mode: "onChange",
    ...props,
  });

  return { form };
}
