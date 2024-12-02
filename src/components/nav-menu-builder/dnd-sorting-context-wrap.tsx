import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FC, ReactNode } from "react";
import { MenuItem, MenuItemsPath } from "./schema";
import { FieldArrayWithId, UseFieldArraySwap } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";

const DndContextWrap: FC<{ children: ReactNode; swap: UseFieldArraySwap }> = ({
  children,
  swap,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const activePath = active.id as MenuItemsPath;
      const overPath = over.id as MenuItemsPath;
      const activeIndex = parseInt(activePath.split(".").at(-1)!, 10);
      const overIndex = parseInt(overPath.split(".").at(-1)!, 10);
      swap(activeIndex, overIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

const SortableContextWrap: FC<{
  path: MenuItemsPath;
  fields: FieldArrayWithId<MenuItem, "items", "id">[];
  children: ReactNode;
}> = ({ path, fields, children }) => {
  return (
    <SortableContext
      items={fields.map((_field, index) =>
        [path, "items", index].filter((i) => i !== "").join("."),
      )}
      strategy={verticalListSortingStrategy}
    >
      {children}
    </SortableContext>
  );
};

export const DnDSortableContextWrap: FC<{
  path: MenuItemsPath;
  fields: FieldArrayWithId<MenuItem, "items", "id">[];
  children: ReactNode;
  swap: UseFieldArraySwap;
}> = ({ swap, ...rest }) => {
  return (
    <DndContextWrap swap={swap}>
      <SortableContextWrap {...rest} />
    </DndContextWrap>
  );
};

type Argument = Parameters<typeof useSortable>[0];
export const useSortsableExtended = (args: Argument) => {
  const sortable = useSortable(args);
  const { transform } = sortable;

  return {
    ...sortable,
    style: {
      transform: CSS.Translate.toString(transform),
      zIndex: transform ? 10 : undefined,
    },
  };
};
