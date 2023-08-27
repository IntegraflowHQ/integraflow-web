import classNames from 'classnames';
import { FunctionComponent, h } from 'preact';
import { useState } from 'preact/hooks';

interface ButtonProps {
  label?: string;
  size?: 'md' | 'sm' | 'full';
  onClick?: () => void;
  classname?: string;
  color?: string;
  textColor?: string;
  hoverColor?: string;
  position?: 'left' | 'right' | 'center';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  onClick,
  classname,
  type,
  hoverColor,
  color = '#050505',
  size = 'md',
  textColor = 'white',
  position = 'left',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  };
  let widthClasses = 'w-auto';

  if (size === 'md') {
    widthClasses = 'w-32';
  } else if (size === 'sm') {
    widthClasses = 'w-fit';
  } else if (size === 'full') {
    widthClasses = 'w-full';
  }

  const buttonPositionClasses =
    position === 'center' ? 'mx-auto' : position === 'right' ? 'ml-auto' : '';

  return (
    <button
      type={type}
      onClick={onClickHandler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? hoverColor ?? color : color,
        color: textColor,
        hoverColor: hoverColor,
      }}
      className={classNames(
        classname,
        widthClasses,
        buttonPositionClasses,
        `block font-semibold  py-2 px-4 rounded-lg`
      )}
    >
      {label}
    </button>
  );
};
