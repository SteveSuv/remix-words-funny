import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";

type IUseZodForm = <T extends z.ZodType<any, any, any>>(
  schema: T,
  props?: UseFormProps<z.infer<T>>,
) => {
  form: UseFormReturn<z.infer<T>>;
};

export const useZodForm: IUseZodForm = (schema, props) => {
  type FormType = z.infer<typeof schema>;

  const form = useForm<FormType>({
    resolver: zodResolver(schema as z.ZodType<FormType, any, any>),
    mode: "onChange",
    ...props,
  });

  return { form };
};
