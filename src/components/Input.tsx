import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FormField, FormFieldType, ID } from '../types';

type Props = {
  label?: string;
  color?: string;
  name: string;
  id: ID;
  type: FormFieldType;
  placeholder?: string;
  onChange: (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void;
};
export const Input = ({
  label,
  color,
  name,
  id,
  placeholder,
  type: type,
  onChange,
}: Props) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    setInputValue(newValue);
    onChange && onChange(event as h.JSX.TargetedEvent<HTMLInputElement, Event>);
  };
  return (
    <div>
      <label
        className={'text-formily-dark-grey block mb-1 font-sans'}
        htmlFor={id + ''}
      >
        {label}
      </label>

      <input
        type={type}
        className={
          'w-full border border-gray-300 rounded-xl p-2 bg-formily-grey focus:outline-none focus:ring-1 focus:border-transparent'
        }
        style={{
          color: color,
          backgroundColor: `${color}1A`,
          // 1A is 10% opacity of the color hex code
        }}
        name={name}
        id={id + ''}
        placeholder={placeholder}
        value={inputValue}
        onInput={handleInputChange}
      />
    </div>
  );
};
