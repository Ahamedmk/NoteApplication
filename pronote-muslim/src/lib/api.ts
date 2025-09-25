import { supabase } from './supabaseClient';
export type ClassRow = { id: string; name: string; teacher_id: string | null };
export type StudentRow = { id: string; first_name: string; last_name: string; parent_user_id: string | null };


export async function getMyProfile(): Promise<Profile> {
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('no auth user');
const { data, error } = await supabase.from('profiles').select('user_id, full_name, role').eq('user_id', user.id).single();
if (error) throw error;
return data as Profile;
}


export async function listTeachers(): Promise<Profile[]> {
const { data, error } = await supabase.from('profiles').select('user_id, full_name, role').eq('role','teacher');
if (error) throw error;
return data as Profile[];
}


// CLASSES
export async function listClasses(): Promise<ClassRow[]> {
const { data, error } = await supabase.from('classes').select('id, name, teacher_id').order('name');
if (error) throw error; return data as ClassRow[];
}


export async function createClass(name: string, teacher_id?: string | null) {
const body: any = { name };
if (teacher_id) body.teacher_id = teacher_id;
const { error } = await supabase.from('classes').insert(body);
if (error) throw error;
}


export async function deleteClass(id: string) {
const { error } = await supabase.from('classes').delete().eq('id', id);
if (error) throw error;
}


// STUDENTS
export async function listStudents(): Promise<StudentRow[]> {
const { data, error } = await supabase.from('students').select('id, first_name, last_name, parent_user_id').order('last_name');
if (error) throw error; return data as StudentRow[];
}


export async function createStudent(first_name: string, last_name: string, parent_user_id?: string | null) {
const body: any = { first_name, last_name };
if (parent_user_id) body.parent_user_id = parent_user_id;
const { error } = await supabase.from('students').insert(body);
if (error) throw error;
}


export async function deleteStudent(id: string) {
const { error } = await supabase.from('students').delete().eq('id', id);
if (error) throw error;
}


// ENROLLMENTS
export async function enrollStudent(student_id: string, class_id: string) {
const { error } = await supabase.from('enrollments').insert({ student_id, class_id });
if (error) throw error;
}


export async function listEnrollments() {
const { data, error } = await supabase.from('enrollments').select('student_id, class_id');
if (error) throw error; return data as {student_id:string; class_id:string}[];
}

// -------- GRADES --------
export async function listEvaluationsByClass(class_id: string) {
const { data, error } = await supabase
.from('grades')
.select('id,label,weight,out_of')
.eq('class_id', class_id)
.order('created_at');
if (error) throw error; return data as {id:string;label:string;weight:number;out_of:number}[];
}


export async function upsertGrade(params: { id?: string; class_id: string; student_id: string; label: string; score: number; out_of: number; weight?: number; }) {
const { error } = await supabase.from('grades').upsert({
id: params.id,
class_id: params.class_id,
student_id: params.student_id,
label: params.label,
score: params.score,
out_of: params.out_of,
weight: params.weight ?? 1,
}, { onConflict: 'id' });
if (error) throw error;
}


export async function deleteEvaluation(eval_id: string) {
const { error } = await supabase.from('grades').delete().eq('id', eval_id);
if (error) throw error;
}


export async function listStudentsInClass(class_id: string) {
const { data, error } = await supabase
.from('enrollments')
.select('student:student_id ( id, first_name, last_name )')
.eq('class_id', class_id);
if (error) throw error;
// map flat
return (data ?? []).map((r:any)=>r.student) as {id:string; first_name:string; last_name:string}[];
}

export function computeAverage(rows: {score:number; out_of:number; weight:number}[]) {
if (!rows || rows.length===0) return null;
let wsum = 0, s = 0;
for (const r of rows) { const w = r.weight ?? 1; wsum += w; s += (r.score/r.out_of)*20*w; }
return Math.round((s/wsum) * 10) / 10; // sur 20, 0.1 près
}


export async function fetchGradesMatrix(class_id: string) {
// récupère toutes les notes de la classe
const { data, error } = await supabase
.from('grades')
.select('id, student_id, label, score, out_of, weight')
.eq('class_id', class_id)
.order('created_at');
if (error) throw error;
return data as {id:string;student_id:string;label:string;score:number;out_of:number;weight:number}[];
}


// -------- ATTENDANCE --------
export async function listAttendanceByDate(class_id: string, dateISO: string) {
const { data, error } = await supabase
.from('attendance')
.select('id, student_id, status')
.eq('class_id', class_id)
.eq('date', dateISO)
.order('created_at');
if (error) throw error; return data as {id:string;student_id:string;status:'present'|'absent'|'late'}[];
}


export async function upsertAttendance(params: { id?: string; class_id: string; student_id: string; dateISO: string; status: 'present'|'absent'|'late' }) {
const { error } = await supabase.from('attendance').upsert({
id: params.id,
class_id: params.class_id,
student_id: params.student_id,
date: params.dateISO,
status: params.status,
}, { onConflict: 'id' });
if (error) throw error;
}

// Teacher: liste des parents liés à MES classes
export async function listParentsForMyClasses() {
  const { data, error } = await supabase.rpc('parents_for_my_classes');
  if (error) throw error;
  return (data ?? []) as { user_id: string; full_name: string | null }[];
}

// Parent: liste des teachers des classes de MES enfants
export async function listTeachersForMyKids() {
  const { data, error } = await supabase.rpc('teachers_for_my_kids');
  if (error) throw error;
  return (data ?? []) as { user_id: string; full_name: string | null }[];
}


export async function fetchThread(other_user_id: string) {
const me = (await supabase.auth.getUser()).data.user?.id as string;
const { data, error } = await supabase
.from('messages')
.select('id, sender_id, recipient_id, body, created_at')
.or(`and(sender_id.eq.${me},recipient_id.eq.${other_user_id}),and(sender_id.eq.${other_user_id},recipient_id.eq.${me})`)
.order('created_at');
if (error) throw error; return data as {id:string;sender_id:string;recipient_id:string;body:string;created_at:string}[];
}


export async function sendMessage(recipient_id: string, body: string, opts?: { student_id?: string; class_id?: string }) {
const me = (await supabase.auth.getUser()).data.user?.id as string;
const { error } = await supabase.from('messages').insert({
sender_id: me,
recipient_id,
body,
student_id: opts?.student_id ?? null,
class_id: opts?.class_id ?? null,
});
if (error) throw error;
}