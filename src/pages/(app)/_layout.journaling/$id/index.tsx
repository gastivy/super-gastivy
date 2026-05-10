import { createFileRoute } from "@tanstack/react-router";

import JournalDetailContainer from "@containers/journaling-app/detail";

const JournalDetailPage = () => {
  return <JournalDetailContainer />;
};

export const Route = createFileRoute("/(app)/_layout/journaling/$id/")({
  component: JournalDetailPage,
});
