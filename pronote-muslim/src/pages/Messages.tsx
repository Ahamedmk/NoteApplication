import { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import Select from '../components/Select';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { supabase } from '../lib/supabaseClient';
import { getMyProfile } from '../lib/api';
import { listParentsForMyClasses, listTeachersForMyKids, fetchThread, sendMessage } from '../lib/api';


export default function Messages() {
const [role, setRole] = useState<'admin'|'teacher'|'parent'|''>('');
const [users, setUsers] = useState<{user_id:string; full_name:string|null}[]>([]);
const [otherId, setOtherId] = useState('');
const [msgs, setMsgs] = useState<any[]>([]);
const [body, setBody] = useState('');
const [loading, setLoading] = useState(false);
const bottomRef = useRef<HTMLDivElement>(null);


useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

useEffect(() => {
  (async () => {
    const me = await getMyProfile();
    setRole(me.role);

    let list: any[] = [];
    if (me.role === 'teacher' || me.role === 'admin') {
      list = await listParentsForMyClasses();
    } else if (me.role === 'parent') {
      list = await listTeachersForMyKids();
    }

    setUsers(list);
    setOtherId(list.length > 0 ? list[0].user_id : ''); // <-- pas de valeur fantôme
  })();
}, []);



const loadThread = async (id?: string) => {
if (!id) return; setLoading(true);
const t = await fetchThread(id);
setMsgs(t);
setLoading(false);
};


useEffect(()=>{ loadThread(otherId); }, [otherId]);


// Realtime (écouter nouveaux messages où je suis impliqué)
useEffect(() => {
const channel = supabase.channel('msg-thread')
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
const m: any = payload.new;
if (m.sender_id === otherId || m.recipient_id === otherId) {
setMsgs(prev => [...prev, m]);
}
})
.subscribe();
return () => { supabase.removeChannel(channel); };
}, [otherId]);

// Exemple React (messages.jsx)
useEffect(() => {
  const channel = supabase
    .channel('messages-room')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        setMsgs((current) => [...current, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


const onSend = async () => {
if (!otherId || !body.trim()) return;
await sendMessage(otherId, body.trim());
setBody('');
};


return (
<div className="mx-auto max-w-[var(--app-max-w)] p-4 space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-xl font-semibold">Messagerie</h2>
<div className="min-w-60">
<Select value={otherId} onChange={(v)=>setOtherId(v)} options={users.map(u=>({ value: u.user_id, label: u.full_name ?? u.user_id.slice(0,8) }))}
disabled={users.length === 0} />
</div>
</div>


<Card>
{loading ? (
<div className="flex items-center gap-2"><Spinner/> <span>Chargement…</span></div>
) : (
<div className="flex h-[60vh] flex-col">
<div className="flex-1 space-y-2 overflow-y-auto p-2">
{msgs.map((m:any)=> (
<div key={m.id} className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.sender_id===users.find(u=>u.user_id===otherId)?.user_id ? 'bg-gray-100 self-start' : 'bg-black text-white self-end'}`}>
{m.body}
<div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
</div>
))}
<div ref={bottomRef} />
</div>
<div className="flex items-center gap-2 border-t p-2">
<input className="flex-1 rounded-xl border px-3 py-2" placeholder="Écrire un message…" value={body} onChange={(e)=>setBody(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') onSend(); }} />
<Button onClick={onSend}>Envoyer</Button>
</div>
</div>
)}
</Card>
</div>
);
}