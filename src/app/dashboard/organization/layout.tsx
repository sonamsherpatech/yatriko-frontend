import Sidebar from "@/lib/components/dashboard/organization/Sidebar";
import Topbar from "@/lib/components/dashboard/organization/Topbar";

export default function OrganizationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
