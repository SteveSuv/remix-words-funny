export const FormFieldError = ({ message }: { message?: string }) => {
  return message ? <div className="text-xs text-danger">{message}</div> : null;
};
