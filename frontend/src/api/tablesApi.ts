import { api } from "./client"
import type { Table } from "@/types/Table"

// Function to find all restaurant tables
export const getTables = async (): Promise<Table[]> => {
    const result = await api.get("/tables")
    return result.data
}