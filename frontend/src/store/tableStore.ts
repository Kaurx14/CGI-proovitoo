import { create } from "zustand"
import { updateTablePosition } from "@/api/tablesApi"
import type { Table } from "@/types/Table"
import { getCellSpan, resolveZoneForPlacement } from "@/utils/floorplan"

// This Zustand store manages the restaurant table layout
type TableStore = {
    tables: Table[]
    moveTable: (tableId: number, x: number, y: number) => Promise<void>
}

export const useTableStore = create<TableStore>((set, get) => ({
    tables: [],
    moveTable: async (tableId, x, y) => {
        const currentTable = get().tables.find((table) => table.id === tableId)
        if (!currentTable) {
          return
        }

        // How many grid cell the table occupies?
        const span = getCellSpan(currentTable.capacity)
        // Which zone does it belong to?
        const updatedZone = resolveZoneForPlacement(x, y, span.colSpan, span.rowSpan)

        if (!updatedZone) {
          return
        }

        // update position in backend
        await updateTablePosition(tableId, x, y, updatedZone)
      
        // Change the local state of tables
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? { ...t, xPosition: x, yPosition: y, zone: updatedZone }
              : t
          )
        }))
      }
}))
