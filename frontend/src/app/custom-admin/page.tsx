import AdminDashboard from "@/components/AdminDashboard";
export const metadata = { title: "Custom Admin", robots: { index: false, follow: false } };
export default function CustomAdminPage() { return <main className="admin-page"><AdminDashboard /></main>; }
