import { FunctionComponent, h } from 'preact';

interface ButtonProps {
  text: string;
  color?: string;
  size?: 'md' | 'sm' | 'full';
  onClick?: () => void;
}

export const Button: FunctionComponent<ButtonProps> = ({
  text,
  onClick,
  color = '#050505',
  size = 'md',
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
      className={`text-white font-semibold py-2 px-4 rounded-xl ${widthClasses}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
};
