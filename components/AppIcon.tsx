interface AppIconProps {
  name:
    | 'home'
    | 'map'
    | 'news'
    | 'board'
    | 'calendar'
    | 'lend'
    | 'people'
    | 'rooms'
    | 'skills'
    | 'more'
    | 'lock'
    | 'arrow'
    | 'plus'
    | 'projects'
    | 'logout'
    | 'chevron'
  className?: string
}

const paths: Record<AppIconProps['name'], React.ReactNode> = {
  home: (
    <>
      <path d="M3.5 11.4 12 4.3l8.5 7.1" />
      <path d="M5.7 10.3v9.2h12.6v-9.2M9.4 19.5v-5.4h5.2v5.4" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s6-4.2 6-10a6 6 0 1 0-12 0c0 5.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  news: (
    <>
      <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5H18v12.5a1.5 1.5 0 0 1-1.5 1.5H8a3 3 0 0 1-3-3V6.5Z" />
      <path d="M8.5 9h6.5M8.5 12.2H15M8.5 15.4h3.5" />
    </>
  ),
  board: (
    <>
      <path d="M6 5h12a1 1 0 0 1 1 1v12H5V6a1 1 0 0 1 1-1Z" />
      <path d="M8.5 9h7M8.5 13h4.5" />
    </>
  ),
  calendar: (
    <>
      <path d="M7 3.5v3M17 3.5v3M4.5 9.5h15" />
      <path d="M6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5Z" />
    </>
  ),
  lend: (
    <>
      <path d="M5 8.5h14v10H5zM8 8.5V6.8A1.8 1.8 0 0 1 9.8 5h4.4A1.8 1.8 0 0 1 16 6.8v1.7" />
      <path d="M5 12.2h14M10.2 12.2v1.4h3.6v-1.4" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0M15.2 6.5a2.7 2.7 0 0 1 0 5.2M16.5 14.2a4.6 4.6 0 0 1 3.7 4.5" />
    </>
  ),
  rooms: (
    <>
      <path d="M4.5 20V7.5A1.5 1.5 0 0 1 6 6h5v14M11 4h7.5A1.5 1.5 0 0 1 20 5.5V20" />
      <path d="M8 10h.1M8 14h.1M15.5 10h.1M15.5 14h.1" />
    </>
  ),
  skills: (
    <>
      <path d="M14.3 7.4a3.2 3.2 0 1 1 2.3 3.1h-1.8l-7.5 7.6a2 2 0 1 1-2.8-2.8l7.5-7.6V6" />
      <path d="m6 14 3.8 3.8" />
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
      <rect x="5.5" y="9" width="13" height="10.5" rx="2" />
      <path d="M12 13v2.5" />
    </>
  ),
  arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  projects: (
    <>
      <path d="M4 20V9l5-3v14M9 20V5l6-2v17M15 20v-9l5-2v11" />
      <path d="M2.5 20h19" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M9 12h9" />
    </>
  ),
  chevron: <path d="m7 9 5 5 5-5" />,
}

export default function AppIcon({ name, className = 'h-5 w-5' }: AppIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
