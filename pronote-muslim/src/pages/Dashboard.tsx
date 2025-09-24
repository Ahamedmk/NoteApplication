import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
const { user, signOut } = useAuth();


return (
<div className="min-h-screen bg-gray-50">
<header className="mx-auto flex max-w-[var(--app-max-w)] items-center justify-between p-4">
<h1 className="text-xl font-semibold">Pronote Muslim — MVP</h1>
<div className="flex items-center gap-3">
<span className="text-sm text-gray-700">{user?.email}</span>
<Button variant="ghost" onClick={signOut}>Se déconnecter</Button>
</div>
</header>


<main className="mx-auto grid max-w-[var(--app-max-w)] gap-4 p-4 md:grid-cols-2">
<Card>
<h2 className="mb-2 text-lg font-semibold">Classes</h2>
<p className="text-sm text-gray-600">(À venir) CRUD classes + élèves</p>
</Card>
<Card>
<h2 className="mb-2 text-lg font-semibold">Notes</h2>
<p className="text-sm text-gray-600">(À venir) Saisie des notes + moyennes</p>
</Card>
<Card>
<h2 className="mb-2 text-lg font-semibold">Présences</h2>
<p className="text-sm text-gray-600">(À venir) Pointage présence/absence</p>
</Card>
<Card>
<h2 className="mb-2 text-lg font-semibold">Messagerie</h2>
<p className="text-sm text-gray-600">(À venir) Parent ↔ Prof</p>
</Card>
</main>
</div>
);
}