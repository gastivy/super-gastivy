import { createFileRoute } from "@tanstack/react-router";
import JournalOverviewContainer from "@containers/journaling-app/overview";

const JournalOverviewPage = () => {
  return <JournalOverviewContainer />;
};

export const Route = createFileRoute("/(app)/_layout/journaling/")({
  component: JournalOverviewPage,
});