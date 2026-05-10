import { LastActivity } from "./LastActivity";
import { ProgressActivty } from "./ProgressActivity";

const ActivityOverviewContainer = () => {
  const hour = new Date().getHours();
  const greeting = (() => {
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 20) return "Good Evening";

    return "Good Night";
  })();

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="text-xl font-medium text-limed-spruce-900 py-5 bg-white p-6 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        {greeting}
      </div>
      <div className="max-[960px]:pb-24 overflow-y-auto flex max-lg:flex-col gap-6 max-lg:gap-8">
        <ProgressActivty />
        <LastActivity />
      </div>
    </div>
  );
};

export default ActivityOverviewContainer;
