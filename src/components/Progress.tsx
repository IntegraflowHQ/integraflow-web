import { h } from 'preact';

export default function Progress({ progress, bgColor }: { progress: number; bgColor: string }) {
  return (
    <div className="h-1 w-full rounded-full bg-slate-200">
      <div
        className="h-1 rounded-full transition-width duration-500"
        style={{ backgroundColor: bgColor, width: `${Math.floor(progress * 100)}%` }}></div>
    </div>
  );
}
