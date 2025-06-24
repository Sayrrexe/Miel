import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    /**
     * Варианты кнопки
     */
    variants: {
      /**
       * Вариант кнопки (primary, destructive, outline, secondary, ghost, link)
       */
      variant: {
        /**
         * Основной стиль кнопки
         */
        default:
          "bg-btn-primary rounded-xl font-normal text-primary-foreground hover:bg-btn-primary-hover",
        /**
         * Стиль кнопки для уничтожения
         */
        destructive:
          "bg-destructive rounded-xl text-destructive-foreground hover:bg-destructive/90",
        /**
         * Стиль кнопки с границей
         */
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        /**
         * Второстепенный стиль кнопки
         */
        secondary:
          "rounded-xl text-black border-btn-primary border-[1px] border-solid font-normal text-secondary-foreground hover:bg-white hover:text-btn-sec-fg-hover hover:border-btn-primary-hover",
        /**
         * Прозрачный стиль кнопки
         */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /**
         * Стиль кнопки для ссылок
         */
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * Размеры кнопки (default, sm, lg, icon)
       */
      size: {
        /**
         * 46x46
         */
        default: "h-11 px-4 py-2",
        /**
         * 36x36
         */
        sm: "h-8 rounded-md px-3 text-xs",
        /**
         * 44x44
         */
        lg: "h-10 rounded-md px-8",
        /**
         * 46x46 (иконка)
         */
        icon: "h-11 w-11",
      },
    },
    /**
     * Значения по умолчанию
     */
    defaultVariants: {
      /**
       * Вариант кнопки
       */
      variant: "default",
      /**
       * Размер кнопки
       */
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Если true, то кнопка будет отображаться как Slot
   */
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export {Button, buttonVariants}