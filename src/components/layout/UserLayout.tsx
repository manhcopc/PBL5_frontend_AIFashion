// import type { ReactNode } from "react";
import { Sidebar } from "../user/Sidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex h-screen bg-white text-black font-sans overflow-hidden">
      {/* bg-black bg-white */}
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
