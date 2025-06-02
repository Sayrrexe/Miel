import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Поле ввода с поддержкой рефов и настраиваемыми свойствами.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} [props.className] - Дополнительные CSS классы.
 * @param {string} [props.type] - Тип поля ввода.
 * @param {React.Ref<HTMLInputElement>} ref - Реф для доступа к элементу ввода.
 * @returns {JSX.Element} Поле ввода.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
