// components/icons.tsx
import { createLucideIcon } from "lucide-react"

// TikTok icon (Lucide-style)
export const TikTokIcon = createLucideIcon("TikTokIcon", [
  ["path", { d: "M16 3a5 5 0 0 0 5 5", key: "p1" }],
  ["path", { d: "M12 3v12.5a3.5 3.5 0 1 1-3-3.465", key: "p2" }],
  ["path", { d: "M16 8.13a5 5 0 0 1-4-2.13", key: "p3" }],
])

// X (Twitter) Logo - Proper SVG Component
export const XIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)