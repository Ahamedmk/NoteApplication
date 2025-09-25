interface Option { value: string; label: string }
export default function Select({ label, options, value, onChange, disabled }: { label?: string; options: Option[]; value?: string; onChange?: (v: string) => void; disabled?: boolean; }) {
return (
<label className="block space-y-1">
{label && <span className="text-sm text-gray-700">{label}</span>}
<select
className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
value={value}
onChange={(e) => onChange?.(e.target.value)}
disabled={disabled}
>
<option value="">-- Sélectionner --</option>
{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
</select>
</label>
);
}