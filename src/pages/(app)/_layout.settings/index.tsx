import { createFileRoute } from "@tanstack/react-router";

import SettingsContainer from "@containers/settings";

const SettingsPage = () => {
  return <SettingsContainer />;
};

export const Route = createFileRoute("/(app)/_layout/settings/")({
  component: SettingsPage,
});
