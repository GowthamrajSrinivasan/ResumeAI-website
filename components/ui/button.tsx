"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-black shadow-card hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-blue-600 text-black shadow-card hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-border bg-blue-600 text-black shadow-sm hover:shadow-card transition-all hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-blue-600 text-black shadow-card hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "bg-blue-600 text-black hover:shadow-card rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
        link:
          "bg-blue-600 text-black underline-offset-4 hover:underline transition-all",
        gradient:
          "bg-blue-600 text-black shadow-card hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] animate-fade-in",
        glass:
          "bg-blue-600 text-black shadow-card hover:shadow-card-hover transition-all border border-transparent hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
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