const options = [
{ v: 'present', label: 'Présent' },
{ v: 'absent', label: 'Absent' },
{ v: 'late', label: 'Retard' },
];
export default function ToggleGroup({ value, onChange, disabled }: { value: 'present'|'absent'|'late'; onChange: (v: any) => void; disabled?: boolean; }) {
return (
<div className="inline-flex overflow-hidden rounded-xl border">
{options.map(o => (
<button key={o.v}
disabled={disabled}
className={`px-3 py-1 text-xs ${value===o.v? 'bg-black text-white':'bg-white text-gray-800 hover:bg-gray-50'} disabled:opacity-60`}
onClick={()=>onChange(o.v)}
>{o.label}</button>
))}
</div>
);
}