import { NavLink } from "react-router-dom";
import { Layers, MessageSquare, ClipboardList } from "lucide-react";

const tabs = [
  { to: "/fragments", label: "カード", icon: Layers },
  { to: "/support", label: "サポート", icon: MessageSquare },
  { to: "/review", label: "振り返り", icon: ClipboardList },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around py-2 z-50">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${
              isActive ? "text-primary font-semibold" : "text-text-secondary"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
