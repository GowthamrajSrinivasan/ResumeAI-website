"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-card transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-gradient-surface border-border/50",
        elevated: "bg-gradient-surface border-border/50 shadow-card-hover",
        glass: "glass border-white/20",
        gradient: "bg-gradient-to-br from-primary-50 to-interactive-50 border-primary-200/30",
        outline: "bg-transparent border-border hover:bg-surface-50/50",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:shadow-card-hover hover:-translate-y-1",
        glow: "hover:shadow-card-hover hover:shadow-primary-500/20",
        scale: "hover:scale-[1.02] hover:shadow-card-hover",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      hover: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hover, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }