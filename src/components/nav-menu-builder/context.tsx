"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import {
  ArrayPath,
  FieldValues,
  Path,
  UseFieldArrayReturn,
} from "react-hook-form";

type ArrayField<
  T extends FieldValues,
  AP extends ArrayPath<T>,
> = UseFieldArrayReturn<T, AP, "id">;
type ArrayFieldByPath<T extends FieldValues, AP extends ArrayPath<T>> = Record<
  string,
  ArrayField<T, AP> | undefined
>;

type NavMenuBuilderContextT<
  T extends FieldValues,
  P extends Path<T>,
  AP extends ArrayPath<T>,
> = {
  preventEditingState: boolean;
  setPreventEditingState: React.Dispatch<React.SetStateAction<boolean>>;
  arrayFieldByPath: ArrayFieldByPath<T, AP>;
  onAddArrayField: (arrayField: ArrayField<T, AP>, path: P) => void;
  onRemoveArrayField: (path: P) => void;
};

const NavMenuBuilderContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NavMenuBuilderContextT<any, any, any> | undefined
>(undefined);

type NavMenuBuilderProviderProps = {
  children: ReactNode;
};

const NavMenuBuilderProvider = <
  T extends FieldValues,
  P extends Path<T>,
  AP extends ArrayPath<T>,
>({
  children,
}: NavMenuBuilderProviderProps) => {
  const [preventEditingState, setPreventEditingState] = useState(true);
  const [arrayFieldByPath, setArrayFieldByPath] = useState<
    ArrayFieldByPath<T, AP>
  >({});

  const onAddArrayField = useCallback(
    (arrayField: ArrayField<T, AP>, path: P) =>
      setArrayFieldByPath((prev) => ({ ...prev, [path]: arrayField })),
    [],
  );
  const onRemoveArrayField = useCallback(
    (path: string) =>
      setArrayFieldByPath((prev) => ({ ...prev, [path]: undefined })),
    [],
  );

  return (
    <NavMenuBuilderContext.Provider
      value={{
        arrayFieldByPath,
        preventEditingState,
        setPreventEditingState,
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
  P extends Path<T>,
  AP extends ArrayPath<T>,
>(): NavMenuBuilderContextT<T, P, AP> => {
  const ctx = useContext(NavMenuBuilderContext);
  if (!ctx) {
    throw new Error(
      "useNavMenuBuilderContext must be used within a NavMenuBuilderProvider",
    );
  }
  return ctx as NavMenuBuilderContextT<T, P, AP>;
};

export { NavMenuBuilderProvider, useNavMenuBuilderContext };
