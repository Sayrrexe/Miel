import * as React from "react";

interface MagnifierProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * @function Magnifier
 * @description Компонент для отображения иконки "Лупа"
 * @param {ShowcaseProps} props - props для компонента
 * @returns {ReactElement} реакт-элемент иконки
 */

const Magnifier = React.forwardRef<SVGSVGElement, MagnifierProps>(
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
          d="M15.1835 7.36853C13.0254 5.21049 9.52657 5.21049 7.36853 7.36853C5.21049 9.52657 5.21049 13.0254 7.36853 15.1835C9.50655 17.3215 12.9606 17.3413 15.1231 15.243C15.1405 15.2211 15.1594 15.1999 15.1797 15.1797C15.1999 15.1594 15.2211 15.1405 15.243 15.1231C17.3413 12.9606 17.3215 9.50655 15.1835 7.36853ZM16.7465 15.6858C18.9763 12.9267 18.8088 8.87254 16.2441 6.30787C13.5003 3.56404 9.05169 3.56404 6.30787 6.30787C3.56404 9.05169 3.56404 13.5003 6.30787 16.2441C8.87254 18.8088 12.9267 18.9763 15.6858 16.7465L18.4697 19.5303C18.7626 19.8232 19.2374 19.8232 19.5303 19.5303C19.8232 19.2374 19.8232 18.7626 19.5303 18.4697L16.7465 15.6858Z"
        />
      </svg>
    )
      ;
  }
);

Magnifier.displayName = "Magnifier";

export {Magnifier};