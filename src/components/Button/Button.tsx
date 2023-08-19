import classNames from 'classnames';
import { h, FunctionComponent } from 'preact';

interface ButtonProps {
  label?: string;
  size?: 'md' | 'sm' | 'full';
  onClick?: () => void;
  classname?: string;
  color: string;
  buttonPosition?: 'left' | 'right' | 'center';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  size = 'md',
  onClick,
  classname,
  type,
  color,
  buttonPosition = 'left',
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
    buttonPosition === 'left'
      ? 'float-left'
      : buttonPosition === 'right'
      ? 'float-right'
      : 'mx-auto';

  return (
    <button
      type={type}
      onClick={onClickHandler}
      className={classNames(
        color ? color : 'bg-formily-black',
        classname,
        widthClasses,
        buttonPositionClasses,
        `block text-white font-semibold bg-formily-black py-2 px-4 rounded-lg`
      )}
    >
      {label}
    </button>
  );
};
