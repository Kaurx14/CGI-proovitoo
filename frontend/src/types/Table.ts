export const TableZone = {
    ALL: "ALL",
    INDOOR: "INDOOR",
    TERRACE: "TERRACE",
    PRIVATE_ROOM: "PRIVATE_ROOM",
} as const

export type TableZone = (typeof TableZone)[keyof typeof TableZone]

export type Table = {
    id: number
    capacity: number
    zone: TableZone
    xPosition: number
    yPosition: number
}
