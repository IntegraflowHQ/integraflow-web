import { h } from 'preact';

type Props = {
  title: string;
  subtext: string;
};

export const ThankYouResponse = ({ title, subtext }: Props) => {
  return (
    <div className={'text-center px-8 min-w-[489px]'}>
      <p className={'text-5xl'}>❤️</p>
      <p className={'text-2xl py-2 font-semibold'}>{title}</p>
      <p>{subtext}</p>
    </div>
  );
};
