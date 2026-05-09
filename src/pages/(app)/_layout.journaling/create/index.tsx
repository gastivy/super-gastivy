import { createFileRoute } from "@tanstack/react-router";
import JournalCreateContainer from "@containers/journaling-app/create";

const JournalCreatePage = () => {
  return <JournalCreateContainer />;
};

export const Route = createFileRoute("/(app)/_layout/journaling/create/")({
  component: JournalCreatePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      date: (search.date as string) || undefined,
      edit: (search.edit as number) || undefined,
    };
  },
});