import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-semibold",
  {
    variants: {
      variant: {
        primary:
          "bg-button-primary text-button-primary-foreground hover:bg-button-primary/90 [&_svg]:fill-button-primary [&_svg]:hover:bg-button-primary/90",
        secondary:
          "border border-border text-foreground-secondary bg-background hover:bg-border/30 [&_svg]:fill-foreground-secondary [&_svg]:hover:bg-border/30",
        "secondary-color":
          "bg-background text-button-secondary-color-foreground hover:bg-button-secondary-color-foreground/10 border border-button-secondary-color-border [&_svg]:fill-background [&_svg]:hover:bg-button-secondary-color-foreground/10",
        plain:
          "text-foreground-secondary hover:text-primary [&_svg]:fill-foreground-secondary [&_svg]:hover:fill-primary",
      },
      size: {
        default: "h-10 px-[14px] py-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
