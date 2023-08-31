import { h, VNode } from 'preact';

export interface HeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  color?: string;
}

export function Header({
  title,
  description,
  centered,
  color = '#050505',
}: HeaderProps): VNode {
  return (
    <header className={`spacey-2 ${centered && 'text-center'}`}>
      <h2 style={{ color }} className='text-sm font-semibold leading-[22px]'>
        {title}
      </h2>
      {description && (
        <span style={{ color }} className='text-xs font-normal leading-[19px]'>
          {description}
        </span>
      )}
    </header>
  );
}
