"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getNewMenuItem, MenuItem, MenuItemPath, useMenuStore } from "./store";
import { UseFormReturn, UseFormStateReturn } from "react-hook-form";
import { DnDActiveWithContext } from "./dnd";
import { BaseMenuItem } from "./schema";

type Form = UseFormReturn<BaseMenuItem>;
type BasicFormState = Pick<
  UseFormStateReturn<BaseMenuItem>,
  "isDirty" | "isValid"
>;
type FormsByItemId = Record<string, Form>;
type BasicFormsStateByItemId = Record<string, BasicFormState>;

type NavMenuBuilderContextT = {
  addEditingItemId: (id: string) => void;
  removeEditingItemId: (id: string) => void;
  // doesn't include top menu item form, as it's always in editing mode
  editingItemIds: string[];
  isDnDAllowed: boolean;
  activeItem?: DnDActiveWithContext;
  handleSetActiveItem: (activeItem: DnDActiveWithContext | undefined) => void;
  formsByItemId: FormsByItemId;
  handleAddFormByItemId: (id: string, form: Form) => void;
  handleRemoveFormByItemId: (id: string) => void;
  basicFormsStateByItemId: BasicFormsStateByItemId;
  handleUpsertBasicFormsStateByItemId: (
    id: string,
    basicFormState: BasicFormState,
  ) => void;
  handleRemoveBasicFormsStateByItemId: (id: string) => void;
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
  const [isDnDAllowed, setIsDnDAllowed] = useState(true);
  const [editingItemIds, setEditingItemIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<
    DnDActiveWithContext | undefined
  >(undefined);
  const [formsByItemId, setFormsByItemId] = useState<FormsByItemId>({});
  const [basicFormsStateByItemId, setFormsStateByItemId] =
    useState<BasicFormsStateByItemId>({});

  useEffect(() => {
    setIsDnDAllowed(!editingItemIds.length);
  }, [editingItemIds]);

  const addEditingItemId = (id: string) => {
    setEditingItemIds((prev) => [...new Set([...prev, id])]);
  };
  const removeEditingItemId = (id: string) => {
    setEditingItemIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSetActiveItem = (activeItem: DnDActiveWithContext | undefined) =>
    setActiveItem(activeItem);

  const handleAddFormByItemId = useCallback(
    (id: string, form: Form) =>
      setFormsByItemId((prev) => ({ ...prev, [id]: form })),
    [],
  );

  const handleRemoveFormByItemId = useCallback(
    (id: string) =>
      setFormsByItemId((prev) => {
        const newFormById = { ...prev };
        delete newFormById[id];
        return newFormById;
      }),
    [],
  );

  const handleUpsertBasicFormsStateByItemId = useCallback(
    (id: string, basicFormState: BasicFormState) => {
      setFormsStateByItemId((prev) => {
        const prevState = prev[id];
        if (
          !prevState ||
          Object.entries(basicFormState).some(
            ([k, v]) => prevState[k as keyof BasicFormState] !== v,
          )
        ) {
          return { ...prev, [id]: basicFormState };
        }
        return prev;
      });
    },
    [],
  );

  const handleRemoveBasicFormsStateByItemId = useCallback(
    (id: string) =>
      setFormsStateByItemId((prev) => {
        const newFormsStateById = { ...prev };
        delete newFormsStateById[id];
        return newFormsStateById;
      }),
    [],
  );

  return (
    <NavMenuBuilderContext.Provider
      value={{
        activeItem,
        handleSetActiveItem,

        isDnDAllowed,

        editingItemIds,
        addEditingItemId,
        removeEditingItemId,

        formsByItemId,
        handleAddFormByItemId,
        handleRemoveFormByItemId,

        basicFormsStateByItemId,
        handleUpsertBasicFormsStateByItemId,
        handleRemoveBasicFormsStateByItemId,
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

export const useIsEditingItem = (id: string) => {
  const { editingItemIds } = useNavMenuBuilderContext();
  return editingItemIds.includes(id);
};

export const useItemActions = (
  id: string,
  path: MenuItemPath,
  prevItem: MenuItem,
) => {
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
    const isNewItem = !prevItem.name;
    if (isNewItem) {
      menuStore.removeItem(path);
    }
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
  const {
    handleAddFormByItemId,
    handleRemoveFormByItemId,
    handleUpsertBasicFormsStateByItemId,
    handleRemoveBasicFormsStateByItemId,
  } = useNavMenuBuilderContext();

  useEffect(() => {
    handleAddFormByItemId(id, form);

    return () => {
      handleRemoveFormByItemId(id);
      handleRemoveBasicFormsStateByItemId(id);
    };
  }, [
    form,
    handleAddFormByItemId,
    handleRemoveBasicFormsStateByItemId,
    handleRemoveFormByItemId,
    id,
  ]);

  const {
    formState: { isDirty, isValid },
  } = form;

  useEffect(() => {
    handleUpsertBasicFormsStateByItemId(id, { isDirty, isValid });
  }, [handleUpsertBasicFormsStateByItemId, id, isDirty, isValid]);
};
