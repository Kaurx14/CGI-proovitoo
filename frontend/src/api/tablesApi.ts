import { api } from "./client"
import type { Table } from "@/types/Table"

// Function to find all restaurant tables
export const getTables = async (): Promise<Table[]> => {
    const result = await api.get("/tables/all")
    console.log(result.data)
    return result.data
}

export const updateTablePosition = async (tableId: number, x: number, y: number) => {
    const result =await api.patch(`/tables/${tableId}/position`, {x, y})
    return result.data
}