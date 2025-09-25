import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Select from '../components/Select';
import Table from '../components/Table';
import Button from '../components/Button';
import NumberField from '../components/NumberField';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import { listClasses } from '../lib/api';
import { listStudentsInClass, fetchGradesMatrix, upsertGrade, deleteEvaluation, computeAverage } from '../lib/api';


export default function Grades() {
const [classes, setClasses] = useState<any[]>([]);
const [classId, setClassId] = useState('');
const [students, setStudents] = useState<any[]>([]);
const [grades, setGrades] = useState<any[]>([]);
const [labels, setLabels] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState<string | null>(null);


const refresh = async (cls?: string) => {
const cid = cls ?? classId;
if (!cid) return;
setLoading(true);
const [studs, grs] = await Promise.all([
listStudentsInClass(cid),
fetchGradesMatrix(cid),
]);
setStudents(studs);
setGrades(grs);
const uniq = Array.from(new Set(grs.map((g:any)=>g.label)));
setLabels(uniq);
setLoading(false);
};


useEffect(()=>{ (async()=>{ const c = await listClasses(); setClasses(c); if (c[0]) { setClassId(c[0].id); await refresh(c[0].id); } })(); }, []);


const byStudent = useMemo(()=>{
const map: Record<string, any[]> = {};
for (const g of grades) { (map[g.student_id] ??= []).push(g); }
return map;
}, [grades]);


const onChangeScore = async (student_id: string, label: string, value: number) => {
const row = grades.find((g:any)=> g.student_id===student_id && g.label===label);
const out_of = row?.out_of ?? 20; const weight = row?.weight ?? 1;
await upsertGrade({ id: row?.id, class_id: classId, student_id, label, score: value, out_of, weight });
setToast('Note enregistrée');
await refresh();
};


const addEvaluation = async () => {
const label = prompt('Nom de l\'évaluation (ex: Contrôle 2)');
if (!label) return;
// crée la colonne pour chaque élève avec score vide (0 par défaut)
for (const s of students) {
await upsertGrade({ class_id: classId, student_id: s.id, label, score: 0, out_of: 20, weight: 1 });
}
await refresh();
};


const removeEvaluation = async (label: string) => {
if (!confirm(`Supprimer l\'évaluation \"${label}\" ?`)) return;
// supprime toutes les lignes grades portant ce label
// (plus efficace côté SQL, mais suffisant pour MVP via delete range)
// on récupère d'abord les IDs concernés
const rows = grades.filter((g:any)=>g.label===label);
for (const r of rows) { await deleteEvaluation(r.id); }
await refresh();
setToast('Évaluation supprimée');
};


return (
<div className="mx-auto max-w-[var(--app-max-w)] p-4 space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-xl font-semibold">Notes</h2>
<div className="flex items-center gap-3">
<Select value={classId} onChange={(v)=>{ setClassId(v); refresh(v); }} options={classes.map((c:any)=>({value:c.id,label:c.name}))} />
<Button onClick={addEvaluation}>+ Évaluation</Button>
</div>
</div>


<Card>
{loading ? <div className="flex items-center gap-2"><Spinner/> <span>Chargement…</span></div> : (
<Table headers={["Élève", ...labels.map(l => `${l}`), "Moyenne"]}>
{students.map((s:any)=>{
const rows = byStudent[s.id] ?? [];
const avg = computeAverage(rows);
return (
<tr key={s.id} className="border-b last:border-none">
<td className="px-3 py-2">{s.last_name.toUpperCase()} {s.first_name}</td>
{labels.map(label=>{
const g = rows.find((r:any)=>r.label===label);
return (
<td key={label} className="px-3 py-2">
<div className="flex items-center gap-2">
<NumberField value={g?.score ?? ''} onChange={(n)=> onChangeScore(s.id, label, n)} />
<Badge>/ {g?.out_of ?? 20}</Badge>
<button className="text-xs text-gray-500 hover:underline" onClick={()=>removeEvaluation(label)}>suppr col</button>
</div>
</td>
);
})}
<td className="px-3 py-2 font-semibold">{avg ?? '—'}</td>
</tr>
);
})}
</Table>
)}
</Card>

{toast && <Toast message={toast} />}
</div>
);
}