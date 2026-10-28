// Small inline icons so we don't need an icon library
type IconProps = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export const HomeIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
)

export const BoxIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </svg>
)

export const UsersIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
  </svg>
)

export const DollarIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.8 7 7s2 3 5 3.7 5 1.6 5 4-2.2 3.8-5 3.8-5-1.2-5-3" />
  </svg>
)

export const CartIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
    <path d="M2 3h3l2.7 12.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6" />
  </svg>
)

export const MenuIcon = ({ className = 'size-6' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const CloseIcon = ({ className = 'size-6' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const LogoutIcon = ({ className = 'size-5' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" />
  </svg>
)
