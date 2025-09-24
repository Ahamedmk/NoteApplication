import clsx from "clsx";


interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
variant?: "primary" | "ghost";
}


export default function Button({ variant = "primary", className, ...props }: Props) {
return (
<button
className={clsx(
"inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
variant === "primary" && "bg-black text-white hover:opacity-90",
variant === "ghost" && "bg-transparent text-black hover:bg-black/5",
className
)}
{...props}
/>
);
}