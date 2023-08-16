import { h, FunctionComponent } from 'preact';

interface ButtonProps {
  label: string;
  size?: 'md' | 'sm' | 'full';
  onClick?: () => void;
}

export const Button: FunctionComponent<ButtonProps> = ({
  label,
  size = 'md',
  onClick,
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

  return (
    <button
      onClick={onClickHandler}
      className={`text-white font-semibold bg-formily-black py-2 px-4 rounded-lg ${widthClasses}`}
    >
      {label}
    </button>
  );
};
