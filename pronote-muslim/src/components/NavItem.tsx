import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

export default function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
const { pathname } = useLocation();
const active = pathname === to || pathname.startsWith(to + "/");
return (
<Link
to={to}
onClick={onClick}
className={clsx(
"block rounded-xl px-3 py-2 text-sm",
active ? "bg-black text-white" : "text-gray-700 hover:bg-black/5"
)}
>
{label}
</Link>
);
}