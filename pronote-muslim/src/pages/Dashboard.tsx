import { useEffect, useState } from 'react';
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useAuth, getCurrentProfile } from "../context/AuthContext";


export default function Dashboard() {
const { user, signOut } = useAuth();
const [role, setRole] = useState<string>('…');


useEffect(() => {
(async () => {
try {
const p = await getCurrentProfile();
setRole(p.role);
} catch (e) {
setRole('inconnu');
}
})();
}, []);


return (
<div className="grid gap-4 md:grid-cols-2">
<Card>
<h2 className="mb-2 text-lg font-semibold">Bienvenue 👋</h2>
<p className="text-sm text-gray-600">Utilise la barre latérale pour naviguer.</p>
</Card>
<Card>
<h2 className="mb-2 text-lg font-semibold">Statut</h2>
<p className="text-sm text-gray-600">MVP en cours : Classes, Élèves, Notes, Présences.</p>
</Card>
</div>
);
}