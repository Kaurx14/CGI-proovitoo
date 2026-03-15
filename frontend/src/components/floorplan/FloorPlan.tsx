import type { Table } from "@/types/Table"
import { TableNode } from "./TableNode"
import { useEffect, useState } from "react"
import { useReservationStore } from "@/store/reservationStore"
import { updateTablePosition } from "@/api/tablesApi"
import { TableZone } from "@/types/Table"
import {
    FLOORPLAN_FEATURES,
    FLOORPLAN_ZONES,
    GRID_COLUMNS,
    GRID_ROWS,
    canPlaceTable,
    clampPlacement,
    getCellSpan,
    resolveZoneForPlacement,
} from "@/utils/floorplan"

type Props = {
    tables: Table[]
    reservedTableIds: number[]
    onTableClick?: (table: Table) => void
    adminMode: boolean
    activeZone?: TableZone
    className?: string
}

// Main component that renders the floor plan. Used both by resrevation page and admin page
export function FloorPlan({
    tables,
    reservedTableIds: reservedTableIdsProp,
    onTableClick,
    adminMode,
    activeZone,
    className = "",
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
    // Clamping logic and other math here created by AI
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      if (!adminMode) return

      const tableId = Number(e.dataTransfer.getData("tableId"))
      if (!tableId) return
  
      const rect = e.currentTarget.getBoundingClientRect()
  
      const cellWidth = rect.width / GRID_COLUMNS
      const cellHeight = rect.height / GRID_ROWS

      const tableToMove = visibleTables.find((table) => table.id === tableId)
      if (!tableToMove) return

      const span = getCellSpan(tableToMove.capacity)
      const pointerX = (e.clientX - rect.left) / cellWidth
      const pointerY = (e.clientY - rect.top) / cellHeight
      const rawX = Math.round(pointerX - span.colSpan / 2)
      const rawY = Math.round(pointerY - span.rowSpan / 2)
      const { x, y } = clampPlacement(rawX, rawY, span)
      const zone = resolveZoneForPlacement(x, y, span.colSpan, span.rowSpan)

      if (!zone) {
        return
      }

      const candidateTable = {
        ...tableToMove,
        xPosition: x,
        yPosition: y,
        zone,
      }

      if (!canPlaceTable(candidateTable, visibleTables)) {
        return
      }

      const previousTables = visibleTables

      setVisibleTables((current) =>
        current.map((table) =>
          table.id === tableId
            ? candidateTable
            : table
        )
      )

      try {
        await updateTablePosition(tableId, x, y, zone)
      } catch {
        setVisibleTables(previousTables)
      }
    }

    return (
        <div
            onDragOver={(e) => {
                if (adminMode) e.preventDefault()
            }}
            onDrop={handleDrop}
            className={`relative grid size-full grid-cols-10 grid-rows-10 gap-2 overflow-hidden rounded-lg border bg-muted ${className}`}
        >
            {FLOORPLAN_ZONES.map((zone) => (
                <div
                    key={zone.zone}
                    style={{
                        gridColumn: `${zone.x + 1} / span ${zone.width}`,
                        gridRow: `${zone.y + 1} / span ${zone.height}`,
                    }}
                    className={
                        zone.zone === "TERRACE"
                            ? "rounded-md bg-emerald-100/70"
                            : zone.zone === "INDOOR"
                              ? "rounded-md bg-amber-100/70"
                              : "rounded-md bg-sky-100/70"
                    }
                >
                    <div className="p-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {zone.zone === "PRIVATE_ROOM" ? "Private room" : zone.zone.toLowerCase()}
                    </div>
                </div>
            ))}
            {FLOORPLAN_FEATURES.map((feature) => (
                <div
                    key={feature.id}
                    style={{
                        gridColumn: `${feature.x + 1} / span ${feature.width}`,
                        gridRow: `${feature.y + 1} / span ${feature.height}`,
                    }}
                    className={`pointer-events-none z-0 rounded-md border border-dashed p-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ${feature.className}`}
                >
                    {feature.label}
                </div>
            ))}
            {visibleTables.map((table) => {
                const { colSpan, rowSpan } = getCellSpan(table.capacity)
                const isReserved = reservedTableIds.includes(table.id)
                const isOutsideSelectedZone = !adminMode && activeZone !== undefined && activeZone !== TableZone.ALL && table.zone !== activeZone

                const handleClick = !isReserved && !isOutsideSelectedZone && onTableClick
                    ? () => onTableClick(table)
                    : undefined

                return (
                    <TableNode
                        key={table.id}
                        table={table}
                        reserved={isReserved}
                        recommended={!adminMode && table.id === recommendedTableId}
                        disabled={isOutsideSelectedZone}
                        colSpan={colSpan}
                        rowSpan={rowSpan}
                        onClick={handleClick}
                        adminMode={adminMode}
                    />
                )
            })}
        </div>
    )
}
