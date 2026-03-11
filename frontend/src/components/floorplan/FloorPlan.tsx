import type { Table } from "@/types/Table"
import { TableNode } from "./TableNode"
import { useReservationStore } from "@/store/reservationStore"

// TODO: use table id not the table object
type Props = {
    tables: Table[]
    reservedTableIds: number[]
    onTableClick?: (table: Table) => void
}

// Main component that renders the floor plan
export function FloorPlan({
    tables,
    onTableClick,
}: Props) {
    // Get all the IDs for the reservatons
    // console.log("Reservations: ", reservations)
    // const reservedIds = reservations.map((r) => r.restaurantTable?.id)
    // console.log("Reserved IDs: ", reservedIds)
    const {
        reservedTableIds,
        recommendedTableId
      } = useReservationStore()
    console.log("Reserved table ids: ", reservedTableIds)
    console.log("Recommended table id: ", recommendedTableId)

    return (
        <div className="grid grid-cols-10 grid-rows-10 gap-2 w-full h-[500px] border rounded-lg bg-muted">
            {tables.map((table) => {
                const { colSpan, rowSpan } = getCellSpan(table.capacity)
                return (
                    <TableNode
                        key={table.id}
                        table={table}
                        reserved={reservedTableIds.includes(table.id)}
                        recommended={table.id === recommendedTableId}
                        colSpan={colSpan}
                        rowSpan={rowSpan}
                        onClick={onTableClick && !reservedTableIds.includes(table.id) ? () => onTableClick(table) : undefined}
                    />
                )
            })}
        </div>
    )
}

function getCellSpan(capacity: number): { colSpan: number; rowSpan: number } {
    if (capacity <= 2) {
      return { colSpan: 1, rowSpan: 1 }
    }
  
    if (capacity <= 4) {
      return { colSpan: 2, rowSpan: 1 }
    }
  
    if (capacity <= 6) {
      return { colSpan: 2, rowSpan: 2 }
    }
  
    // 8 or more seats → big table
    return { colSpan: 3, rowSpan: 2 }
  }