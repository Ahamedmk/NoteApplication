import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";


export default function AppShell({ children }: { children: React.ReactNode }) {
const { user, signOut } = useAuth();
const [role, setRole] = useState<'admin'|'teacher'|'parent'|''>('');
const [menuOpen, setMenuOpen] = useState(false);


useEffect(() => {
(async()=>{
const { data: { user: u } } = await supabase.auth.getUser();
if (!u) return;
const { data } = await supabase.from('profiles').select('role').eq('user_id', u.id).single();
setRole((data?.role as any) ?? '');
})();
}, []);


return (
<div className="min-h-screen bg-gray-50">
<Topbar email={user?.email ?? ''} role={role} onSignOut={signOut} onOpenMenu={()=>setMenuOpen(true)} />
<div className="mx-auto grid max-w-[var(--app-max-w)] grid-cols-1 gap-4 p-4 md:grid-cols-[240px_1fr]">
{/* Sidebar desktop */}
<div className="hidden rounded-2xl border bg-white md:block">
<Sidebar role={(role||'parent') as any} />
</div>
{/* Main */}
<main className="min-h-[60vh]">
{children}
</main>
</div>


{/* Drawer mobile */}
{menuOpen && (
<div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={()=>setMenuOpen(false)}>
<div className="h-full w-64 bg-white p-2" onClick={(e)=>e.stopPropagation()}>
<Sidebar role={(role||'parent') as any} onNavigate={()=>setMenuOpen(false)} />
</div>
</div>
)}
</div>
);
}