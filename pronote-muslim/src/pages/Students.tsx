import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Select from '../components/Select';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { createStudent, deleteStudent, enrollStudent, getMyProfile, listClasses, listStudents } from '../lib/api';


export default function Students() {
const [loading, setLoading] = useState(true);
const [rows, setRows] = useState<any[]>([]);
const [classes, setClasses] = useState<any[]>([]);
const [toast, setToast] = useState<string | null>(null);


const refresh = async () => {
setLoading(true);
const [students, cls] = await Promise.all([
listStudents(),
listClasses(),
]);
setRows(students);
setClasses(cls);
setLoading(false);
};


useEffect(()=>{ refresh(); }, []);


// create student
const [open, setOpen] = useState(false);
const [first, setFirst] = useState('');
const [last, setLast] = useState('');


const onCreate = async () => {
if (!first.trim() || !last.trim()) return;
await createStudent(first.trim(), last.trim());
setOpen(false); setFirst(''); setLast('');
await refresh();
setToast('Élève créé');
};


// enroll
const [enrollOpen, setEnrollOpen] = useState(false);
const [targetStudent, setTargetStudent] = useState<any | null>(null);
const [classId, setClassId] = useState('');


const classOptions = useMemo(() => classes.map((c:any)=>({ value: c.id, label: c.name })), [classes]);


const onEnroll = async () => {
if (!targetStudent?.id || !classId) return;
await enrollStudent(targetStudent.id, classId);
setEnrollOpen(false); setClassId(''); setTargetStudent(null);
setToast('Élève inscrit dans la classe');
};


return (
<div className="mx-auto max-w-[var(--app-max-w)] p-4">
<div className="mb-4 flex items-center justify-between">
<h2 className="text-xl font-semibold">Élèves</h2>
<Button onClick={()=>setOpen(true)}>+ Nouvel élève</Button>
</div>


<Card>
{loading ? (
<div className="flex items-center gap-2"><Spinner /> <span>Chargement…</span></div>
) : (
<Table headers={["Nom", "Actions"]}>
{rows.map(r => (
<tr key={r.id} className="border-b last:border-none">
<td className="px-3 py-2">{r.last_name.toUpperCase()} {r.first_name}</td>
<td className="px-3 py-2 flex gap-2">
<Button variant="ghost" onClick={()=>{ setTargetStudent(r); setEnrollOpen(true); }}>Inscrire en classe</Button>
<Button variant="ghost" onClick={async()=>{ if(confirm('Supprimer cet élève ?')){ await deleteStudent(r.id); await refresh(); setToast('Élève supprimé'); } }}>Supprimer</Button>
</td>
</tr>
))}
</Table>
)}
</Card>

{/* Create */}
<Modal open={open} title="Nouvel élève" onClose={()=>setOpen(false)}>
<div className="space-y-3">
<Input label="Prénom" value={first} onChange={(e)=>setFirst(e.target.value)} />
<Input label="Nom" value={last} onChange={(e)=>setLast(e.target.value)} />
<div className="flex justify-end gap-2">
<Button variant="ghost" onClick={()=>setOpen(false)}>Annuler</Button>
<Button onClick={onCreate}>Créer</Button>
</div>
</div>
</Modal>


{/* Enroll */}
<Modal open={enrollOpen} title={`Inscrire ${targetStudent?.first_name ?? ''}`} onClose={()=>setEnrollOpen(false)}>
<div className="space-y-3">
<Select label="Classe" value={classId} onChange={setClassId} options={classOptions} />
<div className="flex justify-end gap-2">
<Button variant="ghost" onClick={()=>setEnrollOpen(false)}>Annuler</Button>
<Button onClick={onEnroll}>Inscrire</Button>
</div>
</div>
</Modal>


{toast && <Toast message={toast} />}
</div>
);
}