const Ico = ({ children, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">{children}</svg>
)

export const CalendarIcon = (p) => (
  <Ico {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
  </Ico>
)

export const AddVnIcon = (p) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </Ico>
)

export const DashboardIcon = (p) => (
  <Ico {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Ico>
)

export const InventoryIcon = (p) => (
  <Ico {...p}>
    <rect x="3" y="4" width="18" height="4.5" rx="1" />
    <path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5" />
    <path d="M10 12.5h4" />
  </Ico>
)

export const UsageIcon = (p) => (
  <Ico {...p}>
    <rect x="3.5" y="4" width="17" height="17" rx="3" />
    <path d="M9 4V3h6v1" />
    <path d="M12 9v8M8 13h8" />
  </Ico>
)

export const AlertIcon = (p) => (
  <Ico {...p}>
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8" />
    <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
    <path d="M4 3.5 2.5 5M20 3.5 21.5 5" />
  </Ico>
)