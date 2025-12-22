import { ProgressActivty } from "./ProgressActivity";
import { LastActivity } from "./LastActivity";

const ActivityContainer = () => {
  const hour = new Date().getHours();
  const greeting = (() => {
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 20) return "Good Evening";

    return "Good Night";
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium text-limed-spruce-900 py-5">
        {greeting}
      </div>

      <div className="max-lg:max-h-[calc(100dvh-120px)] max-[60rem]:max-h-[calc(100dvh-220px)] overflow-y-auto flex max-lg:flex-col gap-6 max-lg:gap-16">
        <ProgressActivty />
        <LastActivity />
      </div>
    </div>
  );
};

export default ActivityContainer;
