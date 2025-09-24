interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
label?: string;
}


export default function Input({ label, ...props }: Props) {
return (
<label className="block space-y-1">
{label && <span className="text-sm text-gray-700">{label}</span>}
<input
className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
{...props}
/>
</label>
);
}