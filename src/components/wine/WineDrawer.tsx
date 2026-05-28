"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { WineForm } from "./WineForm";
import { useUIStore } from "@/lib/stores/ui-store";
import { useWineActions } from "@/hooks/useWineActions";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDb, type LocalWine } from "@/lib/dexie/db";
import type { WineFormValues } from "@/types/wine";

export function WineDrawer() {
  const { isDrawerOpen, editingWineId, closeDrawer } = useUIStore();
  const { createWine, editWine } = useWineActions();

  // If editing, load the wine data from Dexie
  // useLiveQuery returns undefined while loading, then the value
  const editingWine = useLiveQuery<LocalWine | undefined>(
    () =>
      editingWineId
        ? dexieDb.wines.get(editingWineId)
        : Promise.resolve(undefined),
    [editingWineId],
  );

  const isEdit = Boolean(editingWineId);

  const handleSubmit = async (data: WineFormValues) => {
    if (isEdit && editingWineId) {
      await editWine(editingWineId, data);
    } else {
      await createWine(data);
    }
    closeDrawer();
  };

  // Gate: do not render WineForm until editingWine has resolved from undefined
  const isLoading = isEdit && editingWine === undefined;

  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent className="bg-[#1a0a0a] border-white/10 max-h-[92vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-white text-lg">
            {isEdit ? "Edit Wine" : "Add Wine to Cellar"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-white/40">
              Loading…
            </div>
          ) : (
            <WineForm
              defaultValues={editingWine ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeDrawer}
              isEdit={isEdit}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
