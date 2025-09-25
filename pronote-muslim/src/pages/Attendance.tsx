import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Select from '../components/Select';
import Table from '../components/Table';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import ToggleGroup from '../components/ToggleGroup';
import Button from '../components/Button';
import { listClasses } from '../lib/api';
import { listStudentsInClass, listAttendanceByDate, upsertAttendance } from '../lib/api';


export default function Attendance() {
const [classes, setClasses] = useState<any[]>([]);
const [classId, setClassId] = useState('');
const [dateISO, setDateISO] = useState<string>(new Date().toISOString().slice(0,10));
const [students, setStudents] = useState<any[]>([]);
const [map, setMap] = useState<Record<string,'present'|'absent'|'late'>>({});
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState<string | null>(null);


const refresh = async (cid?: string, d?: string) => {
const c = cid ?? classId; const date = d ?? dateISO; if (!c) return;
setLoading(true);
const [studs, att] = await Promise.all([
listStudentsInClass(c),
listAttendanceByDate(c, date)
]);
setStudents(studs);
const m: Record<string, any> = {};
att.forEach(a => { m[a.student_id] = a.status; });
setMap(m);
setLoading(false);
};


useEffect(()=>{ (async()=>{ const c = await listClasses(); setClasses(c); if (c[0]) { setClassId(c[0].id); await refresh(c[0].id, dateISO); } })(); }, []);


const onToggle = async (student_id: string, status: 'present'|'absent'|'late') => {
setMap(prev=>({ ...prev, [student_id]: status }));
await upsertAttendance({ class_id: classId, student_id, dateISO, status });
setToast('Présence enregistrée');
};
return (
<div className="mx-auto max-w-[var(--app-max-w)] p-4 space-y-4">
<div className="flex flex-wrap items-center gap-3 justify-between">
<h2 className="text-xl font-semibold">Présences</h2>
<div className="flex items-center gap-2">
<Select value={classId} onChange={(v)=>{ setClassId(v); refresh(v, dateISO); }} options={classes.map((c:any)=>({value:c.id,label:c.name}))} />
<input type="date" value={dateISO} onChange={(e)=>{ const d=e.target.value; setDateISO(d); refresh(classId, d); }} className="rounded-xl border border-gray-300 px-3 py-2" />
<Button onClick={()=>refresh()}>Rafraîchir</Button>
</div>
</div>


<Card>
{loading ? <div className="flex items-center gap-2"><Spinner/> <span>Chargement…</span></div> : (
<Table headers={["Élève", "Statut"]}>
{students.map((s:any)=> (
<tr key={s.id} className="border-b last:border-none">
<td className="px-3 py-2">{s.last_name.toUpperCase()} {s.first_name}</td>
<td className="px-3 py-2">
<ToggleGroup value={(map[s.id] ?? 'present') as any} onChange={(v)=>onToggle(s.id, v)} />
</td>
</tr>
))}
</Table>
)}
</Card>


{toast && <Toast message={toast} />}
</div>
);
}