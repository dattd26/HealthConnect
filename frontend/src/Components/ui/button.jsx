import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "button",
  {
    variants: {
      variant: {
        default: "button-primary",
        destructive: "button-error",
        outline: "button-outline",
        secondary: "button-secondary",
        ghost: "button-ghost",
        link: "button-ghost text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
        success: "button-success",
        warning: "button-warning",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1 text-sm",
        lg: "px-8 py-3 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
