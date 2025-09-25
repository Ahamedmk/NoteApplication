export default function NumberField({ value, onChange, min=0, step=0.5, disabled }: { value: number | string; onChange: (n: number) => void; min?: number; step?: number; disabled?: boolean; }) {
return (
<input
type="number"
className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
value={value}
min={min}
step={step}
disabled={disabled}
onChange={(e)=> onChange(parseFloat(e.target.value))}
/>
);
}