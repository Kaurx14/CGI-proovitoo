import { useEffect, useState } from "react"
import type { Table } from "@/types/Table"
import { getTables } from "@/api/tablesApi"

// A custom hook that loads restaurant tables from the backend
// Theyre fetched once the component mounts
export function useTables() {
    const [tables, setTables] = useState<Table[]>([])

    useEffect(() => {
        getTables().then(setTables)
    }, [])

    return tables
}