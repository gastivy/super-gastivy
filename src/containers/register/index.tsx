import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";

import LogoIcon from "@assets/logo-icon/icon-2-160.svg";
import Alert from "@components/base/Alert";
import Button from "@components/base/Button";
import InputText from "@components/base/InputText";
import { routes } from "@constants/routes";
import { useRegister } from "@modules/auth/hooks/useAuth";
import type { RegisterRequest } from "@modules/auth/models/Auth";
import { schemaRegister } from "@modules/auth/schemas/register";

const RegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const { isPending, isError, mutate } = useRegister({
    onSuccess: () => navigate({ to: routes.login.path }),
    onError: ({ response }) => {
      setErrorMessage((response?.data as AxiosError).message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaRegister),
  });

  const handleSubmitForm = (form: RegisterRequest) => {
    mutate(form);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-full flex justify-between items-center fixed top-0 px-12 max-md:px-6 py-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          <img src={LogoIcon} width="40px" />
          <div className="text-slate-700 font-medium text-2xl">Gastivy</div>
        </div>
      </div>

      <div className="w-md flex flex-col items-center justify-center gap-10 max-md:w-full max-md:px-6">
        <div className="flex flex-col items-center gap-1">
          <div className="text-xl font-medium text-slate-700">
            Hello, welcome to Gastivy 👋
          </div>
          <div className="text-sm text-gray-400">
            Please enter your details for your access.
          </div>
        </div>

        <form
          className="w-full flex flex-col items-center gap-4"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          {isError && errorMessage && (
            <Alert message={errorMessage} variant="error" />
          )}

          <div className="w-full flex flex-col items-center gap-4 mb-3">
            <InputText
              label="Name"
              shape="semi-rounded"
              size="large"
              placeholder="Input your name"
              error={errors.name?.message}
              {...register("name")}
            />
            <InputText
              label="Email"
              shape="semi-rounded"
              size="large"
              placeholder="Input your email"
              error={errors.email?.message}
              {...register("email")}
            />
            <InputText
              label="Password"
              type="password"
              size="large"
              shape="semi-rounded"
              placeholder="Input your password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="flex dfitems-center gap-1">
            <div className="text-slate-700 text-sm">
              Already have an account
            </div>
            <div
              className="font-medium text-brand-500 text-sm cursor-pointer"
              onClick={() => navigate({ to: "/login" })}
            >
              Sign in now
            </div>
          </div>

          <Button
            widthFull
            shape="semi-round"
            size="large"
            disabled={isPending || isError}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterContainer;
