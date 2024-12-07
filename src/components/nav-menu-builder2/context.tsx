"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ArrayPath, FieldValues, UseFieldArrayReturn } from "react-hook-form";

type ArrayField<
  T extends FieldValues,
  AP extends ArrayPath<T>,
> = UseFieldArrayReturn<T, AP, "id">;
type ArrayFieldById<T extends FieldValues, AP extends ArrayPath<T>> = Record<
  string,
  ArrayField<T, AP> | undefined
>;

type NavMenuBuilderContextT<T extends FieldValues, AP extends ArrayPath<T>> = {
  arrayFieldById: ArrayFieldById<T, AP>;
  onAddArrayField: (arrayField: ArrayField<T, AP>, id: string) => void;
  onRemoveArrayField: (id: string) => void;
};

const NavMenuBuilderContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NavMenuBuilderContextT<any, any> | undefined
>(undefined);

type NavMenuBuilderProviderProps = {
  children: ReactNode;
};

const NavMenuBuilderProvider = <
  T extends FieldValues,
  AP extends ArrayPath<T>,
>({
  children,
}: NavMenuBuilderProviderProps) => {
  const [arrayFieldById, setArrayFieldById] = useState<ArrayFieldById<T, AP>>(
    {},
  );
  const [isEditingAllowed, setIsEditingAllowed] = useState(false);
  const [editingItemIds, setEditingItemIds] = useState<string[]>([]);

  const onAddArrayField = useCallback(
    (arrayField: ArrayField<T, AP>, id: string) =>
      setArrayFieldById((prev) => ({ ...prev, [id]: arrayField })),
    [],
  );
  const onRemoveArrayField = useCallback(
    (path: string) =>
      setArrayFieldById((prev) => ({ ...prev, [path]: undefined })),
    [],
  );

  return (
    <NavMenuBuilderContext.Provider
      value={{
        arrayFieldById,
        onAddArrayField,
        onRemoveArrayField,
      }}
    >
      {children}
    </NavMenuBuilderContext.Provider>
  );
};

const useNavMenuBuilderContext = <
  T extends FieldValues,
  AP extends ArrayPath<T>,
>(): NavMenuBuilderContextT<T, AP> => {
  const ctx = useContext(NavMenuBuilderContext);
  if (!ctx) {
    throw new Error(
      "useNavMenuBuilderContext must be used within a NavMenuBuilderProvider",
    );
  }
  return ctx as NavMenuBuilderContextT<T, AP>;
};

export { NavMenuBuilderProvider, useNavMenuBuilderContext };

export const useHandleArrayFieldById = <
  T extends FieldValues,
  AP extends ArrayPath<T>,
>(
  arrayField: ArrayField<T, AP>,
  id: string,
) => {
  const { onAddArrayField, onRemoveArrayField } = useNavMenuBuilderContext<
    T,
    AP
  >();
  useEffect(() => {
    onAddArrayField(arrayField, id);

    return () => onRemoveArrayField(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
};

