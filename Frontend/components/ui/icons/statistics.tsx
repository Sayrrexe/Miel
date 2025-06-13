import * as React from "react";

interface StatisticsProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * @function Statistics
 * @description Компонент для отображения иконки "Статистика"
 * @param {ShowcaseProps} props - props для компонента
 * @returns {ReactElement} реакт-элемент иконки
 */

const Statistics = React.forwardRef<SVGSVGElement, StatisticsProps>(
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
          d="M17.25 5C17.25 3.48079 18.4808 2.25 20 2.25C21.5192 2.25 22.75 3.48079 22.75 5V19C22.75 20.5192 21.5192 21.75 20 21.75C18.4808 21.75 17.25 20.5192 17.25 19V5ZM20 3.75C19.3092 3.75 18.75 4.30921 18.75 5V19C18.75 19.6908 19.3092 20.25 20 20.25C20.6908 20.25 21.25 19.6908 21.25 19V5C21.25 4.30921 20.6908 3.75 20 3.75ZM9.25 10.684C9.25 9.16479 10.4808 7.934 12 7.934C13.5192 7.934 14.75 9.16479 14.75 10.684V19C14.75 20.5192 13.5192 21.75 12 21.75C10.4808 21.75 9.25 20.5192 9.25 19V10.684ZM12 9.434C11.3092 9.434 10.75 9.99321 10.75 10.684V19C10.75 19.6908 11.3092 20.25 12 20.25C12.6908 20.25 13.25 19.6908 13.25 19V10.684C13.25 9.99321 12.6908 9.434 12 9.434ZM1.25 16.368C1.25 14.8488 2.48079 13.618 4 13.618C5.51921 13.618 6.75 14.8488 6.75 16.368V19C6.75 20.5192 5.51921 21.75 4 21.75C2.48079 21.75 1.25 20.5192 1.25 19V16.368ZM4 15.118C3.30921 15.118 2.75 15.6772 2.75 16.368V19C2.75 19.6908 3.30921 20.25 4 20.25C4.69079 20.25 5.25 19.6908 5.25 19V16.368C5.25 15.6772 4.69079 15.118 4 15.118Z"
        />
      </svg>
    );
  }
);

Statistics.displayName = "Statistics";

export {Statistics};