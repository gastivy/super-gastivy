import React from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import RegisterContainer from "@containers/register";
import { routes } from "@constants/routes";

const RegisterPage: React.FC = () => {
  return <RegisterContainer />;
};

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
  beforeLoad: async () => {
    const token = await cookieStore.get(import.meta.env.VITE_KEY_ACCESS_TOKEN);
    if (token) {
      throw redirect({ to: routes.activity.home.path });
    }
  },
});
