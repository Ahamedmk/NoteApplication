import { useEffect, useState } from 'react';


export default function Toast({ message }: { message: string }) {
const [open, setOpen] = useState(true);
useEffect(() => {
const id = setTimeout(() => setOpen(false), 2500);
return () => clearTimeout(id);
}, []);
if (!open) return null;
return (
<div className="fixed bottom-4 right-4 rounded-xl bg-black px-4 py-2 text-white shadow-lg">
{message}
</div>
);
}