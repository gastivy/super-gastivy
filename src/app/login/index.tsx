import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import LoginContainer from "@containers/login";
import { routes } from "@constants/routes";

const LoginPage: React.FC = () => {
  return <LoginContainer />;
};

export const Route = createFileRoute("/login/")({
  component: LoginPage,
  beforeLoad: async () => {
    const token = await cookieStore.get(import.meta.env.VITE_KEY_ACCESS_TOKEN);
    if (token) {
      throw redirect({ to: routes.activity.home.path });
    }
  },
});
