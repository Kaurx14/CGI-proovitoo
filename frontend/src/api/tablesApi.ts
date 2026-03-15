import { api } from "./client"
import type { Table, TableZone } from "@/types/Table"

// Function to find all restaurant tables
export const getTables = async (): Promise<Table[]> => {
    const result = await api.get("/tables/all")
    return result.data
}

// Update the table position
export const updateTablePosition = async (tableId: number, x: number, y: number, zone: TableZone) => {
    const result =await api.patch(`/tables/${tableId}/position`, { x, y, zone })
    return result.data
}
