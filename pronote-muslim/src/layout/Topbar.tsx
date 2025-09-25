import Button from "../components/Button";


export default function Topbar({ email, role, onSignOut, onOpenMenu }: { email?: string; role?: string; onSignOut: () => void; onOpenMenu: () => void; }) {
return (
<header className="flex h-14 items-center justify-between border-b bg-white px-3">
<div className="flex items-center gap-2">
<button className="rounded-lg px-2 py-1 hover:bg-black/5 md:hidden" onClick={onOpenMenu}>☰</button>
<span className="text-sm text-gray-600 hidden sm:inline">{role ? `rôle: ${role}` : ''}</span>
</div>
<div className="flex items-center gap-2">
<span className="text-sm text-gray-700 max-sm:hidden">{email}</span>
<Button variant="ghost" onClick={onSignOut}>Se déconnecter</Button>
</div>
</header>
);
}