import type { Table } from "@/types/Table"
import { cn } from "@/lib/utils"

type Props = {
    table: Table
    reserved: boolean
    recommended: boolean
    onClick?: () => void
}

// Visual representation of a single table in the floor plan
// Tables are positioned absolutely using x and y coordinates
// States of a table: reserved -> red, recommended -> green, free -> gray
export function TableNode({ table, reserved, recommended, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            style={{
                left: table.x,
                top: table.y,
            }}
            className={cn(
                "absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-sm font-medium",
                reserved && "bg-red-400",
                recommended && "bg-green-400 ring-4 ring-green-200",
                !reserved && !recommended && "bg-gray-300"
            )}
        >
            {table.capacity}
        </div>
    )
}