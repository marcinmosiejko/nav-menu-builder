"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { DnDActiveWithContext } from "./dnd";
import { getNewMenuItem, MenuItem, MenuItemPath, useMenuStore } from "./store";
import { useForm } from "react-hook-form";

type Form = ReturnType<typeof useForm<any>>;
type FormByItemId = Record<string, Form | undefined>;

type NavMenuBuilderContextT = {
  addEditingItemId: (id: string) => void;
  removeEditingItemId: (id: string) => void;
  editingItemIds: string[];
  isEditingAllowed: boolean;
  handleSetIsEditingAllowed: (isAllowed: boolean) => void;
  activeItem?: DnDActiveWithContext;
  handleSetActiveItem: (activeItem: DnDActiveWithContext | undefined) => void;
  handleAddFormByItemId: (id: string, form: Form) => void;
  handleRemoveFormByItemId: (id: string) => void;
  formByItemId: FormByItemId;
};

const NavMenuBuilderContext = createContext<NavMenuBuilderContextT | undefined>(
  undefined,
);

type NavMenuBuilderProviderProps = {
  children: ReactNode;
};
export const NavMenuBuilderProvider = ({
  children,
}: NavMenuBuilderProviderProps) => {
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);
  const [editingItemIds, setEditingItemIds] = useState<string[]>([]);
  const [formByItemId, setFormByItemId] = useState<FormByItemId>({});
  const [activeItem, setActiveItem] = useState<
    DnDActiveWithContext | undefined
  >(undefined);

  useEffect(() => {
    setIsEditingAllowed(!activeItem?.id);
  }, [activeItem?.id]);

  const addEditingItemId = (id: string) => {
    setEditingItemIds((prev) => [...new Set([...prev, id])]);
  };
  const removeEditingItemId = (id: string) => {
    setEditingItemIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSetIsEditingAllowed = (isAllowed: boolean) =>
    setIsEditingAllowed(isAllowed);

  const handleSetActiveItem = (activeItem: DnDActiveWithContext | undefined) =>
    setActiveItem(activeItem);

  const handleAddFormByItemId = (id: string, form: Form) =>
    setFormByItemId((prev) => ({ ...prev, [id]: form }));

  const handleRemoveFormByItemId = (id: string) =>
    setFormByItemId((prev) => ({ ...prev, [id]: undefined }));

  return (
    <NavMenuBuilderContext.Provider
      value={{
        addEditingItemId,
        removeEditingItemId,
        editingItemIds,
        isEditingAllowed,
        handleSetIsEditingAllowed,
        activeItem,
        handleSetActiveItem,
        handleAddFormByItemId,
        handleRemoveFormByItemId,
        formByItemId,
      }}
    >
      {children}
    </NavMenuBuilderContext.Provider>
  );
};

export const useNavMenuBuilderContext = (): NavMenuBuilderContextT => {
  const ctx = useContext(NavMenuBuilderContext);
  if (!ctx) {
    throw new Error(
      "useNavMenuBuilderContext must be used within a NavMenuBuilderProvider",
    );
  }
  return ctx as NavMenuBuilderContextT;
};

export const useIsEditing = (id: string) => {
  const { editingItemIds, isEditingAllowed } = useNavMenuBuilderContext();
  return editingItemIds.includes(id) && isEditingAllowed;
};

export const useItemActions = (id: string, path: MenuItemPath) => {
  const menuStore = useMenuStore();
  const { addEditingItemId, removeEditingItemId } = useNavMenuBuilderContext();

  const handleAddItem = () => {
    const newItem = getNewMenuItem();
    addEditingItemId(newItem.id);
    menuStore.appendItem(path, newItem);
  };
  const handleEditItem = () => {
    addEditingItemId(id);
  };
  const handleSaveItem = (newItem: MenuItem) => {
    removeEditingItemId(newItem.id);
    menuStore.updateItem(path, newItem);
  };
  const handleRemoveItem = () => {
    menuStore.removeItem(path);
  };
  const handleCancelEditItem = () => {
    removeEditingItemId(id);
  };

  return {
    handleAddItem,
    handleEditItem,
    handleSaveItem,
    handleRemoveItem,
    handleCancelEditItem,
  };
};

export const useTrackActiveForms = (id: string, form: Form) => {
  const { handleAddFormByItemId, handleRemoveFormByItemId } =
    useNavMenuBuilderContext();

  useEffect(() => {
    handleAddFormByItemId(id, form);

    return () => handleRemoveFormByItemId(id);
  }, [id]);
};
