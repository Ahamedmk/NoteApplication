export default function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
return (
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-gray-100 text-left text-sm">
{headers.map(h => <th key={h} className="border-b px-3 py-2 font-medium text-gray-700">{h}</th>)}
</tr>
</thead>
<tbody className="text-sm">{children}</tbody>
</table>
</div>
);
}