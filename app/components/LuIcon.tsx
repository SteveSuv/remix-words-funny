import { LucideIcon, LucideProps } from "lucide-react";

export const LuIcon = (props: LucideProps & { icon: LucideIcon }) => {
  const Icon = props.icon;

  return (
    <Icon
      {...props}
      size={props.size || 18}
      strokeWidth={props.strokeWidth || 1.5}
    />
  );
};
