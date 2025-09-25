import NavItem from "../components/NavItem";


export default function Sidebar({ role, onNavigate }: { role: 'admin'|'teacher'|'parent'; onNavigate?: () => void }) {
const items = [
{ to: "/app", label: "Dashboard", roles: ["admin","teacher","parent"] as const },
{ to: "/app/classes", label: "Classes", roles: ["admin","teacher"] as const },
{ to: "/app/students", label: "Élèves", roles: ["admin","teacher"] as const },
{ to: "/app/grades", label: "Notes", roles: ["admin","teacher","parent"] as const },
{ to: "/app/attendance", label: "Présences", roles: ["admin","teacher","parent"] as const },
{ to: "/app/messages", label: "Messagerie", roles: ["admin","teacher","parent"] as const },
];
return (
<aside className="flex h-full w-60 flex-col gap-2 p-3">
<div className="px-2 py-3 text-lg font-semibold">Pronote Muslim</div>
<nav className="flex-1 space-y-1">
{items.filter(i=>i.roles.includes(role as any)).map(i => (
<NavItem key={i.to} to={i.to} label={i.label} onClick={onNavigate} />
))}
</nav>
<div className="px-2 pb-2 text-[11px] text-gray-500">v0.1 MVP</div>
</aside>
);
}