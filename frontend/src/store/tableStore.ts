import { create } from "zustand"
import { updateTablePosition } from "@/api/tablesApi"
import type { Table } from "@/types/Table"


type TableStore = {
    tables: Table[]
    moveTable: (tableId: number, x: number, y: number) => Promise<void>
}

export const useTableStore = create<TableStore>((set) => ({
    tables: [],
    moveTable: async (tableId, x, y) => {
        await updateTablePosition(tableId, x, y)
      
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? { ...t, xPosition: x, yPosition: y }
              : t
          )
        }))
      }
}))
