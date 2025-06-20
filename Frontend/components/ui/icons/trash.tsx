import * as React from "react";

interface TrashProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * @function Trash
 * @description Компонент для отображения иконки "Удалить"
 * @param {ShowcaseProps} props - props для компонента
 * @returns {ReactElement} реакт-элемент иконки
 */

const Trash = React.forwardRef<SVGSVGElement, TrashProps>(
  ({className, size = 24, ...props}, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        ref={ref}
        {...props}
      >

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.25 3.75C8.25 3.33579 8.58579 3 9 3H15C15.4142 3 15.75 3.33579 15.75 3.75C15.75 4.16421 15.4142 4.5 15 4.5H9C8.58579 4.5 8.25 4.16421 8.25 3.75ZM4.25 7C4.25 6.58579 4.58579 6.25 5 6.25H19C19.4142 6.25 19.75 6.58579 19.75 7C19.75 7.41421 19.4142 7.75 19 7.75H18.75V18C18.75 19.5192 17.5192 20.75 16 20.75H8C6.48079 20.75 5.25 19.5192 5.25 18V7.75H5C4.58579 7.75 4.25 7.41421 4.25 7ZM6.75 7.75V18C6.75 18.6908 7.30921 19.25 8 19.25H16C16.6908 19.25 17.25 18.6908 17.25 18V7.75H6.75ZM10 10.25C10.4142 10.25 10.75 10.5858 10.75 11V16C10.75 16.4142 10.4142 16.75 10 16.75C9.58579 16.75 9.25 16.4142 9.25 16V11C9.25 10.5858 9.58579 10.25 10 10.25ZM14 10.25C14.4142 10.25 14.75 10.5858 14.75 11V16C14.75 16.4142 14.4142 16.75 14 16.75C13.5858 16.75 13.25 16.4142 13.25 16V11C13.25 10.5858 13.5858 10.25 14 10.25Z"
        />

      </svg>
    );
  }
);

Trash.displayName = "Trash";

export {Trash};