"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const MailInput: React.FC<Props> = ({
  className,
  name,
  label,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string;

  return (
    <div className={className}>
      {label && <p className="font-medium mb-2">{label}</p>}

      <div className="relative">
        <Input
          className={`${errorText && "text-red-500"}`}
          {...register(name)}
          {...props}
        />
      </div>
    </div>
  );
};
