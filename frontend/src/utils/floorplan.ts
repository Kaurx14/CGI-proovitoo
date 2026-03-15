import type { Table, TableZone } from "@/types/Table"

/* The following util script is created by AI.
    It includes helper functions to get table size,
    check whether a table overlaps and whether a table can be placed.
    We also define zone area and preference area types here.
*/

export const GRID_COLUMNS = 10
export const GRID_ROWS = 10

type Span = {
    colSpan: number
    rowSpan: number
}

type ZoneArea = {
    zone: TableZone
    x: number
    y: number
    width: number
    height: number
}

type FeatureArea = {
    id: string
    label: string
    x: number
    y: number
    width: number
    height: number
    className: string
}

// Here we assign the zones and their sizes
export const FLOORPLAN_ZONES: ZoneArea[] = [
    { zone: "TERRACE", x: 0, y: 0, width: 10, height: 5 },
    { zone: "INDOOR", x: 0, y: 5, width: 10, height: 3 },
    { zone: "PRIVATE_ROOM", x: 0, y: 8, width: 10, height: 2 },
]

export const FLOORPLAN_FEATURES: FeatureArea[] = [
    {
        id: "indoor-window-left",
        label: "Near window",
        x: 0,
        y: 5,
        width: 2,
        height: 3,
        className: "bg-white/35 border-white/60",
    },
    {
        id: "indoor-window-right",
        label: "Near window",
        x: 8,
        y: 5,
        width: 2,
        height: 3,
        className: "bg-white/35 border-white/60",
    },
    {
        id: "terrace-play-area",
        label: "Near play area",
        x: 7,
        y: 0,
        width: 3,
        height: 3,
        className: "bg-orange-200/55 border-orange-300/80",
    },
]

// Calculate size of table
export function getCellSpan(capacity: number): Span {
    if (capacity <= 2) {
        return { colSpan: 1, rowSpan: 1 }
    }

    if (capacity <= 4) {
        return { colSpan: 2, rowSpan: 1 }
    }

    if (capacity <= 6) {
        return { colSpan: 2, rowSpan: 2 }
    }

    return { colSpan: 3, rowSpan: 2 }
}

export function clampPlacement(x: number, y: number, span: Span) {
    return {
        x: Math.max(0, Math.min(GRID_COLUMNS - span.colSpan, x)),
        y: Math.max(0, Math.min(GRID_ROWS - span.rowSpan, y)),
    }
}

// If we place here, which zone does this table go to then?
export function resolveZoneForPlacement(
    x: number,
    y: number,
    colSpan: number,
    rowSpan: number
): TableZone | null {
    const matchingZones = FLOORPLAN_ZONES.filter((zone) => (
        x >= zone.x &&
        y >= zone.y &&
        x + colSpan <= zone.x + zone.width &&
        y + rowSpan <= zone.y + zone.height
    ))

    return matchingZones[0]?.zone ?? null
}

export function tablesOverlap(a: Table, b: Table) {
    const aSpan = getCellSpan(a.capacity)
    const bSpan = getCellSpan(b.capacity)

    return !(
        a.xPosition + aSpan.colSpan <= b.xPosition ||
        b.xPosition + bSpan.colSpan <= a.xPosition ||
        a.yPosition + aSpan.rowSpan <= b.yPosition ||
        b.yPosition + bSpan.rowSpan <= a.yPosition
    )
}

export function canPlaceTable(candidate: Table, tables: Table[]) {
    const span = getCellSpan(candidate.capacity)
    const zone = resolveZoneForPlacement(
        candidate.xPosition,
        candidate.yPosition,
        span.colSpan,
        span.rowSpan
    )

    if (!zone) {
        return false
    }

    return tables.every((table) => (
        table.id === candidate.id || !tablesOverlap(candidate, table)
    ))
}
