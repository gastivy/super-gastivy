import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "@components/section/Sidebar";
import BottomBar from "@components/section/BottomBar";
import TimerPopover from "@components/section/TimerPopover";

export const Route = createFileRoute("/(app)/_layout")({
  component: NotesLayout,
});

function NotesLayout() {
  return (
    <div className="min-h-screen max-h-screen relative flex bg-white-shark">
      <Sidebar />
      <main className="relative flex-1 px-5 py-4 max-[60rem]:pb-30">
        <TimerPopover />
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
