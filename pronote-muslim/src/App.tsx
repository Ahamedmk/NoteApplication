import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./layout/AppShell";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Messages from "./pages/Messages";


export default function App() {
return (
<Routes>
<Route path="/login" element={<Login />} />


<Route
path="/app"
element={
<ProtectedRoute>
<AppShell>
<Dashboard />
</AppShell>
</ProtectedRoute>
}
/>


{/* Routes enfants dans le même shell */}
<Route
path="/app/classes"
element={<ProtectedRoute><AppShell><Classes /></AppShell></ProtectedRoute>}
/>
<Route
path="/app/students"
element={<ProtectedRoute><AppShell><Students /></AppShell></ProtectedRoute>}
/>
<Route
path="/app/grades"
element={<ProtectedRoute><AppShell><Grades /></AppShell></ProtectedRoute>}
/>
<Route
path="/app/attendance"
element={<ProtectedRoute><AppShell><Attendance /></AppShell></ProtectedRoute>}
/>


<Route path="*" element={<Navigate to="/app" replace />} />
<Route path="/app/messages" element={<ProtectedRoute><AppShell><Messages/></AppShell></ProtectedRoute>} />
</Routes>
);
}