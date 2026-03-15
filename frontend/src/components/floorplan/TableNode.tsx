import type { Table } from "@/types/Table"
import { cn } from "@/lib/utils"

type Props = {
    table: Table
    reserved: boolean
    recommended: boolean
    disabled?: boolean
    colSpan: number
    rowSpan: number
    onClick?: () => void
    adminMode:boolean
}

// Visual representation of a single table in the floor plan
// Tables are positioned absolutely using x and y coordinates
// States of a table: reserved -> red, recommended -> green, free -> gray
export function TableNode({ table, reserved, recommended, disabled = false, colSpan, rowSpan, onClick, adminMode }: Props) {
    return (
        <div
            draggable={adminMode}
            onDragStart={(e) => {
                e.dataTransfer.setData("tableId", String(table.id))
            }}
            onClick={onClick}
            // Treat table.x / table.y as grid coordinates (0–9) and place table there.
            style={{
                gridColumn: `${table.xPosition + 1} / span ${colSpan}`,
                gridRow: `${table.yPosition + 1} / span ${rowSpan}`,
            }}
            title={`Table ${table.id} – ${table.capacity} seats`}
            className={cn(
                "z-10 flex h-full w-full items-center justify-center rounded-md text-sm font-medium transition-opacity",
                !disabled && "cursor-pointer",
                disabled && "cursor-not-allowed opacity-40",
                reserved && "bg-red-400",
                recommended && "bg-green-400 ring-4 ring-green-200",
                !reserved && !recommended && "bg-gray-300"
            )}
        >
            {table.capacity}
        </div>
    )
}
