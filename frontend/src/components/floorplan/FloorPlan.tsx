import type { Table } from "@/types/Table"
import { TableNode } from "./TableNode"
import { useEffect, useState } from "react"
import { useReservationStore } from "@/store/reservationStore"
import { updateTablePosition } from "@/api/tablesApi"

// TODO: use table id not the table object
type Props = {
    tables: Table[]
    reservedTableIds: number[]
    onTableClick?: (table: Table) => void
    adminMode: boolean
}

// Main component that renders the floor plan
export function FloorPlan({
    tables,
    reservedTableIds: reservedTableIdsProp,
    onTableClick,
    adminMode
}: Props) {
    const [visibleTables, setVisibleTables] = useState<Table[]>(tables)
    const {
        reservedTableIds: storeReservedTableIds,
        recommendedTableId
      } = useReservationStore()
    const reservedTableIds = reservedTableIdsProp.length > 0 ? reservedTableIdsProp : storeReservedTableIds

    useEffect(() => {
        setVisibleTables(tables)
    }, [tables])

    // Dragging and dropping for the admin view
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      if (!adminMode) return

      const tableId = Number(e.dataTransfer.getData("tableId"))
      if (!tableId) return
  
      const rect = e.currentTarget.getBoundingClientRect()
  
      const cellWidth = rect.width / 10
      const cellHeight = rect.height / 10
  
      const x = Math.max(0, Math.min(9, Math.floor((e.clientX - rect.left) / cellWidth)))
      const y = Math.max(0, Math.min(9, Math.floor((e.clientY - rect.top) / cellHeight)))

      setVisibleTables((current) =>
        current.map((table) =>
          table.id === tableId
            ? { ...table, xPosition: x, yPosition: y }
            : table
        )
      )

      try {
        await updateTablePosition(tableId, x, y)
      } catch {
        setVisibleTables(tables)
      }
    }

    return (
        <div
            onDragOver={(e) => {
                if (adminMode) e.preventDefault()
            }}
            onDrop={handleDrop}
            className="grid grid-cols-10 grid-rows-10 gap-2 w-full h-[500px] border rounded-lg bg-muted">
            {visibleTables.map((table) => {
                const { colSpan, rowSpan } = getCellSpan(table.capacity)
                const isReserved = reservedTableIds.includes(table.id)
                return (
                    <TableNode
                        key={table.id}
                        table={table}
                        reserved={isReserved}
                        recommended={!adminMode && table.id === recommendedTableId}
                        colSpan={colSpan}
                        rowSpan={rowSpan}
                        onClick={onTableClick && !isReserved ? () => onTableClick(table) : undefined}
                        adminMode={adminMode}
                    />
                )
            })}
        </div>
    )
}

// retrieves the size of the table on the grid basically
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
