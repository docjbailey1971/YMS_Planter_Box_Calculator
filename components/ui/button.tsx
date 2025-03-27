import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700", className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
