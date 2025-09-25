import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Select from '../components/Select';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { createClass, deleteClass, getMyProfile, listClasses, listTeachers } from '../lib/api';


export default function Classes() {
const [loading, setLoading] = useState(true);
const [me, setMe] = useState<{role:'admin'|'teacher'|'parent'} | null>(null);
const [rows, setRows] = useState<any[]>([]);
const [teachers, setTeachers] = useState<any[]>([]);
const [toast, setToast] = useState<string | null>(null);


const isAdmin = me?.role === 'admin';
const isTeacher = me?.role === 'teacher';


// fetch
const refresh = async () => {
setLoading(true);
const [profile, classes] = await Promise.all([
getMyProfile(),
listClasses(),
]);
setMe({ role: profile.role });
setRows(classes);
if (profile.role === 'admin') {
setTeachers(await listTeachers());
}
setLoading(false);
};


useEffect(() => { refresh(); }, []);


// modal create
const [open, setOpen] = useState(false);
const [name, setName] = useState('');
const [teacherId, setTeacherId] = useState('');


const teacherOptions = useMemo(() => teachers.map((t:any) => ({ value: t.user_id, label: t.full_name ?? t.user_id.slice(0,8) })), [teachers]);


const onCreate = async () => {
if (!name.trim()) return;
await createClass(name.trim(), isAdmin ? (teacherId || null) : undefined);
setOpen(false); setName(''); setTeacherId('');
await refresh();
setToast('Classe créée');
};


const onDelete = async (id: string) => {
if (!confirm('Supprimer cette classe ?')) return;
await deleteClass(id);
await refresh();
setToast('Classe supprimée');
};

return (
<div className="mx-auto max-w-[var(--app-max-w)] p-4">
<div className="mb-4 flex items-center justify-between">
<h2 className="text-xl font-semibold">Classes</h2>
{(isAdmin || isTeacher) && <Button onClick={() => setOpen(true)}>+ Nouvelle classe</Button>}
</div>


<Card>
{loading ? (
<div className="flex items-center gap-2"><Spinner /> <span>Chargement…</span></div>
) : (
<Table headers={["Nom de la classe", "Professeur", "Actions"]}>
{rows.map(r => (
<tr key={r.id} className="border-b last:border-none">
<td className="px-3 py-2">{r.name}</td>
<td className="px-3 py-2">{r.teacher_id ? teachers.find((t:any)=>t.user_id===r.teacher_id)?.full_name ?? r.teacher_id.slice(0,8) : <span className="text-gray-400">—</span>}</td>
<td className="px-3 py-2">
<Button variant="ghost" onClick={() => onDelete(r.id)}>Supprimer</Button>
</td>
</tr>
))}
</Table>
)}
</Card>


<Modal open={open} title="Nouvelle classe" onClose={() => setOpen(false)}>
<div className="space-y-3">
<Input label="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
{isAdmin && (
<Select label="Professeur (optionnel)" value={teacherId} onChange={setTeacherId} options={teacherOptions} />
)}
<div className="flex justify-end gap-2">
<Button variant="ghost" onClick={()=>setOpen(false)}>Annuler</Button>
<Button onClick={onCreate}>Créer</Button>
</div>
</div>
</Modal>


{toast && <Toast message={toast} />}
</div>
);
}