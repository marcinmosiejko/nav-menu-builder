import {
  Active,
  DataRef,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  Over,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FC, ReactNode } from "react";
import { MenuItem } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import {
  addNode,
  getItem,
  getParentArray,
  getParentId,
  getParentItems,
  removeNode,
  updateNode,
} from "./utils";
import { MenuItemStats } from "./menu-item/menu-item";
import { useNavMenuBuilderContext } from "./context";

export type DnDItemWithContext<T> = T & {
  id: string;
  data: DataRef<MenuItemStats & { item: MenuItem }>;
};
export type DnDActiveWithContext = DnDItemWithContext<Active>;
export type DnDOverWithContext = DnDItemWithContext<Over>;

export const DndContextWrap = <A extends Active>({
  children,
  beforeOnDragStart,
  afterOnDragEnd,
  setActiveItem,
  form,
}: {
  children: ReactNode;
  form: UseFormReturn<MenuItem, unknown, undefined>;
  beforeOnDragStart: () => void;
  afterOnDragEnd: () => void;
  setActiveItem: (item: A | null) => void;
}) => {
  const { arrayFieldById } = useNavMenuBuilderContext();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    beforeOnDragStart();
    setActiveItem(active as unknown as A);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const active = event.active as DnDActiveWithContext | null;
    const over = event.over as DnDOverWithContext | null;

    if (active === null || over === null) {
      return false;
    }

    const newFormValues = structuredClone(form.getValues());
    let newItems = newFormValues.items;
    const activeId = active.id as string;
    const overId = over.id as string;

    const overParentId = getParentId(overId, newItems);
    const activeParentId = getParentId(activeId, newItems);

    if (overParentId === activeParentId) {
      // d&d within parent is handled in handleDragEnd
      return false;
    }

    const activeItem = getItem(activeId, newItems)!;

    if (activeParentId === undefined && overParentId === undefined) {
      const activeOverId = getParentId(overId, newItems);
      const parentItems = getParentItems(activeOverId, newItems)!;
      const activeIndex = parentItems.findIndex((item) => item.id === activeId);
      const overIndex = parentItems.findIndex((item) => item.id === overId);
      const moveItems = arrayMove(parentItems, activeIndex, overIndex);

      newItems = updateNode(newItems, activeOverId, moveItems);
    } else {
      const items = getParentArray(overId, newItems)!;

      // Ensure drop of sortItem into sortable occurs once
      if (items.find((item) => item.id === activeId)) {
        return false;
      }

      if (overParentId === undefined) {
        // Remove from original
        removeNode(activeId, newItems);

        // Add new
        newItems = addNode(newItems, undefined, activeItem);

        // Move to new place
        const activeOverId = getParentId(overId, newItems);
        const parentItems =
          getParentItems<MenuItem[]>(activeOverId, newItems) || [];
        const activeIndex = parentItems?.findIndex(
          (item) => item.id === activeId,
        );
        const overIndex = parentItems.findIndex((item) => item.id === overId);
        const moveItems = arrayMove(parentItems, activeIndex, overIndex);
        newItems = updateNode<MenuItem[]>(newItems, activeOverId, moveItems);
      } else {
        // Remove from original
        removeNode(activeId, newItems);

        // Add new
        newItems = addNode(newItems, overParentId, activeItem);

        // Move to new place
        const parentItems = getItem(overParentId, newItems)!.items;
        const activeIndex = parentItems.findIndex(
          (item) => item.id === activeId,
        );
        const overIndex = parentItems?.findIndex((item) => item.id === overId);
        const moveItems = arrayMove(parentItems, activeIndex, overIndex);
        newItems = updateNode(newItems, overParentId, moveItems);
      }
    }

    form.reset({ ...newFormValues, items: newItems });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const active = event.active as DnDActiveWithContext;
    const over = event.over as DnDOverWithContext | undefined;

    if (!over) return null;

    if (over?.id && active.id !== over.id) {
      const activeCtx = active.data.current!;
      const overCtx = over.data.current!;

      const activePath = activeCtx.path;
      const overPath = overCtx.path;

      const activeParentPath = activeCtx.parentPath;
      const overParentPath = overCtx.parentPath;

      if (activeParentPath !== overParentPath) return false;
      const item = form.getValues(activeParentPath);
      const arrayField = arrayFieldById[item.id]!;
      const activeIndex = parseInt(activePath.split(".").at(-1)!, 10);
      const overIndex = parseInt(overPath.split(".").at(-1)!, 10);

      arrayField.swap(activeIndex, overIndex);
    }
    afterOnDragEnd();
  };

  const handleDragCancel = () => {
    setActiveItem(null);
    afterOnDragEnd();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      {children}
    </DndContext>
  );
};

export const SortableContextWrap: FC<{
  items: MenuItem[];
  children: ReactNode;
}> = ({ items, children }) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};

type Argument = Parameters<typeof useSortable>[0];
export const useSortableExtended = (args: Argument) => {
  const sortable = useSortable(args);
  const { transform, transition } = sortable;

  return {
    ...sortable,
    style: {
      transform: CSS.Translate.toString(transform),
      transition,
    },
  };
};
