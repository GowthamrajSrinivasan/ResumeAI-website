"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const inputVariants = cva(
  "flex h-10 w-full rounded-lg border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:border-primary-300 focus-visible:border-primary-400",
        error: "border-error-500 focus-visible:border-error-500 focus-visible:ring-error-200",
        success: "border-success-500 focus-visible:border-success-500 focus-visible:ring-success-200",
        glass: "glass border-white/20 text-surface-900 placeholder:text-surface-600",
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base px-4",
        xl: "h-14 text-lg px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  success?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, leftIcon, rightIcon, error, success, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"

    const inputVariant = error ? "error" : success ? "success" : variant

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            inputVariants({ variant: inputVariant, inputSize, className }),
            leftIcon && "pl-10",
            (rightIcon || isPassword) && "pr-10"
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-error-500 animate-slide-down">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-1 text-sm text-success-500 animate-slide-down">
            {success}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }