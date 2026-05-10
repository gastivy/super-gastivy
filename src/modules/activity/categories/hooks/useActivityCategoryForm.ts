import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import { routes } from "@constants/routes";
import useDisclosure from "@hooks/useDisclosure";

import type { CategoryRequest } from "../models";
import { schemaCategory } from "../schema/category";

import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategoryById,
  useUpdateCategory,
} from "./useCategory";

export const useActivityCategoryForm = () => {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const confirmDeleteModal = useDisclosure({ open: false });
  const { categoryId, isCreated } = routerState.location.state;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCategory),
  });

  const title = (() =>
    isCreated ? "Add Activity Category" : "Edit Activity Category")();

  const { data, isLoading: isLoadingGetCategory } = useGetCategoryById(
    categoryId as string,
    {
      enabled: Boolean(categoryId),
      queryKey: ["category-by-id", categoryId],
    }
  );

  const name = getValues("name");
  const target = getValues("target");

  const { isPending: isPendingUpdate, mutate: updateCategory } =
    useUpdateCategory({
      onSuccess: () => {
        navigate({ to: routes.activity.categories.path });
      },
    });

  const { isPending: isPendingCreate, mutate: createCategory } =
    useCreateCategory({
      onSuccess: () => {
        navigate({ to: routes.activity.categories.path });
      },
    });

  const { isPending: isPendingDelete, mutate: deleteCategory } =
    useDeleteCategory({
      onSuccess: () => {
        confirmDeleteModal.onClose();
        navigate({ to: routes.activity.categories.path });
      },
    });

  const isLoading =
    isLoadingGetCategory ||
    isPendingDelete ||
    isPendingUpdate ||
    isPendingCreate;

  const handleUpsert = (form: CategoryRequest) => {
    if (isCreated) {
      createCategory(form);
      return;
    }
    updateCategory({ ...form, id: String(categoryId) });
  };

  const handeDelete = () => {
    deleteCategory({ categoryIds: [String(categoryId)] });
  };

  const handleBack = () => {
    reset();
    navigate({ to: routes.activity.categories.path });
  };

  useEffect(() => {
    setValue("name", data?.data.name as string);
    setValue("target", data?.data.target as number);
    setValue("start_date", data?.data.start_date as Date);
  }, [data?.data]);

  return {
    title,
    control,
    isLoading,
    name,
    target,
    confirmDeleteModal,
    errors,
    register,
    handeDelete,
    handleSubmit,
    handleUpsert,
    handleBack,
  };
};
