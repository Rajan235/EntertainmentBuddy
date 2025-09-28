import {
  LayoutDashboard,
  List,
  Compass,
  BarChart2,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Lists",
    href: "/lists",
    icon: List,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    name: "Statistics",
    href: "/stats",
    icon: BarChart2,
  },
];
