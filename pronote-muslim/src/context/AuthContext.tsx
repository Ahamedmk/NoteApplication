import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";


interface AuthContextType {
user: User | null;
loading: boolean;
signIn: (email: string, password: string) => Promise<{ error?: string }>;
signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
let mounted = true;


const init = async () => {
const { data } = await supabase.auth.getSession();
if (!mounted) return;
setUser(data.session?.user ?? null);
setLoading(false);
};


init();


const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});


return () => {
mounted = false;
sub.subscription.unsubscribe();
};
}, []);


const signIn = async (email: string, password: string) => {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) return { error: error.message };
return {};
};


const signOut = async () => {
await supabase.auth.signOut();
};


return (
<AuthContext.Provider value={{ user, loading, signIn, signOut }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error("useAuth must be used within AuthProvider");
return ctx;
};