import { forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:hover:bg-orange-800 dark:hover:text-orange-100 disabled:opacity-50 dark:focus:ring-orange-400 disabled:pointer-events-none dark:focus:ring-offset-orange-900 data-[state=open]:bg-orange-100 dark:data-[state=open]:bg-orange-800",
  {
    variants: {
      variant: {
        default:
          "bg-orange-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
        outline:
          "bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
