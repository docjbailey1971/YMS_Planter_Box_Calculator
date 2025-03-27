import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("w-full px-3 py-2 border border-gray-300 rounded focus:outline-none", className)}
      {...props}
    />
  )
);

Input.displayName = "Input";
