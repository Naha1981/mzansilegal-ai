import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'glassmorphism' } // Add variant prop
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      // Apply glassmorphism class if variant is set, otherwise default styles
      // Note: Direct application in legalese-ai.tsx might be simpler for now
      // variant === 'glassmorphism' ? 'glassmorphism-card' : '',
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Updated CardTitle to use h3 for better semantics and apply specific styling
const CardTitle = React.forwardRef<
  HTMLHeadingElement, // Changed to HTMLHeadingElement
  React.HTMLAttributes<HTMLHeadingElement> // Changed to HTMLHeadingElement
>(({ className, children, ...props }, ref) => (
  <h3 // Use h3 tag
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Base styles from Shadcn
      // Custom styles based on guidelines - can be overridden by parent component styles
      "text-center", // Center the text
      "md:text-xl", // Adjusted size for card title context
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

// Updated CardDescription to use p tag for better semantics
const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed to HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement> // Changed to HTMLParagraphElement
>(({ className, children, ...props }, ref) => (
  <p // Use p tag
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground", // Base styles from Shadcn
      // Custom styles based on guidelines - can be overridden by parent component styles
      "md:text-base", // Adjusted size
      className
      )}
    {...props}
  >
    {children}
  </p>
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

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }