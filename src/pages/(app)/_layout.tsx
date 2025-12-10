import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "@components/section/Sidebar";
import BottomBar from "@components/section/BottomBar";

export const Route = createFileRoute("/(app)/_layout")({
  component: NotesLayout,
});

function NotesLayout() {
  return (
    <div className="min-h-screen relative flex bg-white-shark">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
