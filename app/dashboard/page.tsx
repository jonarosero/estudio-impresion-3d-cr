import { DashboardView } from "@/components/dashboard/dashboard-view";
import { Suspense } from "react";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() { return <Suspense fallback={null}><DashboardView /></Suspense>; }
