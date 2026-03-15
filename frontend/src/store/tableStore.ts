import { create } from "zustand"
import { updateTablePosition } from "@/api/tablesApi"
import type { Table } from "@/types/Table"
import { getCellSpan, resolveZoneForPlacement } from "@/utils/floorplan"


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

        const span = getCellSpan(currentTable.capacity)
        const updatedZone = resolveZoneForPlacement(x, y, span.colSpan, span.rowSpan)

        if (!updatedZone) {
          return
        }

        await updateTablePosition(tableId, x, y, updatedZone)
      
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? { ...t, xPosition: x, yPosition: y, zone: updatedZone }
              : t
          )
        }))
      }
}))
