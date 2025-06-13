import * as React from "react";

interface NotificationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * @function Notification
 * @description Компонент для отображения иконки "Уведомления"
 * @param {ShowcaseProps} props - props для компонента
 * @returns {ReactElement} реакт-элемент иконки
 */

const Notification = React.forwardRef<SVGSVGElement, NotificationProps>(
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
          d="M9.25509 4.83172C9.34204 3.3913 10.5377 2.25 12 2.25C13.4623 2.25 14.658 3.3913 14.745 4.83172C17.1041 5.8831 18.75 8.24849 18.75 11V14.1585C18.75 14.4984 18.8851 14.8244 19.1254 15.0647L20.5304 16.4697C20.7449 16.6842 20.809 17.0068 20.6929 17.287C20.5768 17.5673 20.3034 17.75 20 17.75H15.75V18C15.75 20.0711 14.0711 21.75 12 21.75C9.92895 21.75 8.25002 20.0711 8.25002 18V17.75H4.00002C3.69668 17.75 3.4232 17.5673 3.30711 17.287C3.19103 17.0068 3.25519 16.6842 3.46969 16.4697L4.87462 15.0647C5.11499 14.8244 5.25002 14.4984 5.25002 14.1585V11C5.25002 8.24849 6.89597 5.8831 9.25509 4.83172ZM9.75002 17.75V18C9.75002 19.2426 10.7574 20.25 12 20.25C13.2427 20.25 14.25 19.2426 14.25 18V17.75H9.75002ZM12 3.75C11.3097 3.75 10.75 4.30964 10.75 5V5.34142C10.75 5.65928 10.5497 5.94262 10.25 6.04855C8.20986 6.76962 6.75002 8.71529 6.75002 11V14.1585C6.75002 14.8962 6.45695 15.6037 5.93528 16.1254L5.81068 16.25H18.1894L18.0648 16.1254C17.5431 15.6037 17.25 14.8962 17.25 14.1585V11C17.25 8.71529 15.7902 6.76962 13.7501 6.04855C13.4504 5.94262 13.25 5.65928 13.25 5.34142V5C13.25 4.30964 12.6904 3.75 12 3.75Z"
        />
      </svg>
    );
  }
);

Notification.displayName = "Notification";

export {Notification};