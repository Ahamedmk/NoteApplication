export default function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void; }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
<div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
<div className="mb-3 flex items-center justify-between">
<h3 className="text-lg font-semibold">{title}</h3>
<button onClick={onClose} className="rounded-lg px-2 py-1 text-sm hover:bg-black/5">✕</button>
</div>
{children}
</div>
</div>
);
}