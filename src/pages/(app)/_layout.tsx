import { createFileRoute, Outlet } from "@tanstack/react-router";

import BottomBar from "@components/section/BottomBar";
import Sidebar from "@components/section/Sidebar";
import TimerPopover from "@components/section/TimerPopover";

export const Route = createFileRoute("/(app)/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <div className="h-screen max-h-dvh relative flex bg-white-shark">
      <Sidebar />
      <main className="h-screen relative flex-1 p-4 max-[960px]:py-0 overflow-y-auto">
        <TimerPopover />
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
