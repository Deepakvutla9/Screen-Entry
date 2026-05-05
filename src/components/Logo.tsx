import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  href?: string;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: 'text-base',   gap: 'gap-2' },
  md: { icon: 36, text: 'text-xl',     gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-3xl',    gap: 'gap-3' },
};

function LogoIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer rounded square — crimson */}
      <rect width="40" height="40" rx="10" fill="#8B1A1A" />

      {/* Clapperboard top bar */}
      <rect x="6" y="6" width="28" height="9" rx="2.5" fill="white" fillOpacity="0.18" />

      {/* Diagonal stripe marks on top bar */}
      <line x1="13" y1="6" x2="10" y2="15" stroke="white" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="6" x2="16" y2="15" stroke="white" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="6" x2="22" y2="15" stroke="white" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />

      {/* Screen body */}
      <rect x="6" y="17" width="28" height="17" rx="2.5" fill="white" fillOpacity="0.10" />

      {/* Gold play triangle */}
      <path d="M17 21.5 L26 25.5 L17 29.5 Z" fill="#F59E0B" />
    </svg>
  );
}

export function Logo({ size = 'md', variant = 'light', href = '/', className = '' }: LogoProps) {
  const { icon, text, gap } = sizes[size];

  const textEl = (
    <span className={`${text} font-black tracking-tight leading-none`}>
      {variant === 'light' ? (
        <>
          <span className="text-white">Screen</span>
          {' '}
          <span className="text-amber-400">Entry</span>
        </>
      ) : (
        <>
          <span className="text-[#1a0505]">Screen</span>
          {' '}
          <span className="text-[#8B1A1A]">Entry</span>
        </>
      )}
    </span>
  );

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      <LogoIcon size={icon} />
      {textEl}
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg">
      {inner}
    </Link>
  );
}
