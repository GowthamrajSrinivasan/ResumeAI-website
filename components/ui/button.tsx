"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold text-white ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
        destructive:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
        outline:
          "border border-border bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
        secondary:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
        ghost:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
        link:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] underline-offset-4 hover:underline transition-all",
        gradient:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)] animate-fade-in",
        glass:
          "bg-[linear-gradient(to_right,#2563eb,#60a5fa)] shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)]",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
        xl: "px-10 py-5 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }