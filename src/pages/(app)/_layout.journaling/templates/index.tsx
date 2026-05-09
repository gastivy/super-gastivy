import { createFileRoute } from "@tanstack/react-router";
import JournalTemplatesContainer from "@containers/journaling-app/templates";

const JournalTemplatesPage = () => {
  return <JournalTemplatesContainer />;
};

export const Route = createFileRoute("/(app)/_layout/journaling/templates/")({
  component: JournalTemplatesPage,
});