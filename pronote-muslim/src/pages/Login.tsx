import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";


export default function Login() {
const { signIn } = useAuth();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);


const onSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
setError(null);
const { error } = await signIn(email, password);
setLoading(false);
if (error) return setError(error);
navigate("/app");
};


return (
<div className="grid min-h-screen place-items-center bg-gray-50 p-4">
<div className="w-full max-w-md">
<h1 className="mb-6 text-center text-2xl font-semibold">Connexion</h1>
<form onSubmit={onSubmit} className="space-y-4">
<Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
<Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
{error && <p className="text-sm text-red-600">{error}</p>}
<Button type="submit" disabled={loading} className="w-full">
{loading ? "Connexion…" : "Se connecter"}
</Button>
</form>
</div>
</div>
);
}