import classNames from 'classnames';
import { FunctionComponent, h } from 'preact';

interface ButtonProps {
  label?: string;
  size?: 'md' | 'sm' | 'full';
  onClick?: () => void;
  classname?: string;
  color?: string;
  textColor?: string;
  position?: 'left' | 'right' | 'center';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  size = 'md',
  onClick,
  classname,
  type,
  color,
  textColor = 'white',
  position = 'left',
}) => {
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
    position === 'center'
      ? 'mx-auto'
      : position === 'right'
      ? 'ml-auto'
      : 'mr-auto';

  return (
    <button
      type={type}
      onClick={onClickHandler}
      style={{ backgroundColor: color ? color : '#050505', color: textColor }}
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
