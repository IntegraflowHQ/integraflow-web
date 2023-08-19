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
      <h2 style={{ color }} className='text-xl font-medium'>
        {title}
      </h2>
      {description && <span style={{ color }}>{description}</span>}
    </header>
  );
}
