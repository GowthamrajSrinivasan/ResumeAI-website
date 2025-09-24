"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
        secondary:
          "border-transparent bg-surface-200 text-surface-900 hover:bg-surface-300",
        destructive:
          "border-transparent bg-error-500 text-white hover:bg-error-600 shadow-sm",
        success:
          "border-transparent bg-success-500 text-white hover:bg-success-600 shadow-sm",
        warning:
          "border-transparent bg-warning-500 text-white hover:bg-warning-600 shadow-sm",
        outline:
          "border-border text-foreground hover:bg-surface-100",
        gradient:
          "border-transparent bg-gradient-to-r from-primary-500 to-interactive-500 text-white shadow-sm hover:shadow-card",
        glass:
          "glass border-white/20 text-surface-900 hover:bg-white/20",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }