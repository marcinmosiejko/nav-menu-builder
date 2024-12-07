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
import { MenuItem, MoveItem, SetItems } from "./store";

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
  setItems,
  items,
  moveItem,
}: {
  children: ReactNode;
  beforeOnDragStart: () => void;
  afterOnDragEnd: () => void;
  setActiveItem: (item?: A) => void;
  setItems: SetItems;
  items: MenuItem[];
  moveItem: MoveItem;
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    // beforeOnDragStart();
    setActiveItem(active as unknown as A);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const active = event.active as DnDActiveWithContext | null;
    const over = event.over as DnDOverWithContext | null;

    if (active === null || over === null) {
      return false;
    }

    let newItems = structuredClone(items);

    const activeId = active.id as string;
    const overId = over.id as string;

    const overParentId = getParentId(overId, newItems);
    const activeParentId = getParentId(activeId, newItems);

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
      // This prevents move within same level (except for top items) which is done in handleDragEnd
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

    setItems(newItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(undefined);

    const active = event.active as DnDActiveWithContext;
    const over = event.over as DnDOverWithContext | undefined;

    if (!over) return null;

    if (over.id && active.id !== over.id) {
      const activeCtx = active.data.current!;
      const overCtx = over.data.current!;

      const activePath = activeCtx.path;
      const newIndex = overCtx.path.at(-1)!;

      const activeParentId = activeCtx.parentId;
      const overParentId = overCtx.parentId;

      if (activeParentId !== overParentId) return false;

      moveItem(activePath, newIndex);
    }
    // afterOnDragEnd();
  };

  const handleDragCancel = () => {
    setActiveItem(undefined);
    // afterOnDragEnd();
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
  const { transform } = sortable;

  return {
    ...sortable,
    style: {
      transform: CSS.Translate.toString(transform),
    },
  };
};
