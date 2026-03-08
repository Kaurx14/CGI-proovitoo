import type { Table } from "@/types/Table"
import type { Reservation } from "@/types/Reservation"
import { TableNode } from "./TableNode"

type Props = {
    tables: Table[]
    reservations: Reservation[]
    recommendedTableId?: number
}

// Main component that renders the floor plan
export function FloorPlan({
    tables,
    reservations,
    recommendedTableId,
}: Props) {
    // Get all the IDs for the reservatons
    const reservedIds = reservations.map((r) => r.tableId)

    return (
        <div className="relative w-full h-[500px] border rounded-lg bg-muted">
            {tables.map((table) => (
                <TableNode
                    key={table.id}
                    table={table}
                    reserved={reservedIds.includes(table.id)}
                    recommended={table.id === recommendedTableId}
                />
            ))}
        </div>
    )
}