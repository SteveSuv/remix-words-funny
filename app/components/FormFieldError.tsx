export const FormFieldError = ({ message }: { message?: string }) => {
  return message ? <div className="text-danger text-xs">{message}</div> : null;
};
