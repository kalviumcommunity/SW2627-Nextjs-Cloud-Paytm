import { auth } from "@/lib/auth";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  const user = await auth();

  return <Dashboard user={user} />;
}