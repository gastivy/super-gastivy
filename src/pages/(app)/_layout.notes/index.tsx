import NotesContainer from "@containers/notes";
import { createFileRoute } from "@tanstack/react-router";

const NotesPage = () => {
  return <NotesContainer />;
};

export const Route = createFileRoute("/(app)/_layout/notes/")({
  component: NotesPage,
});
