import type { Table } from "@/types/Table"
import { cn } from "@/lib/utils"

type Props = {
    table: Table
    reserved: boolean
    recommended: boolean
    colSpan: number
    rowSpan: number
    onClick?: () => void
}

// Visual representation of a single table in the floor plan
// Tables are positioned absolutely using x and y coordinates
// States of a table: reserved -> red, recommended -> green, free -> gray
export function TableNode({ table, reserved, recommended, colSpan, rowSpan, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            // Treat table.x / table.y as grid coordinates (0–9) and place table there.
            style={{
                gridColumn: `${table.xPosition + 1} / span ${colSpan}`,
                gridRow: `${table.yPosition + 1} / span ${rowSpan}`,
            }}
            title={`Table ${table.id} – ${table.capacity} seats`}
            className={cn(
                "flex items-center justify-center cursor-pointer text-sm font-medium rounded-md w-full h-full",
                reserved && "bg-red-400",
                recommended && "bg-green-400 ring-4 ring-green-200",
                !reserved && !recommended && "bg-gray-300"
            )}
        >
            {table.capacity}
        </div>
    )
}