import type { Table } from "./Table"

export type Reservation = {
    id: number
    tableId: number // TODO: This currently is redundant with restaurantTable.id
    date: string
    startTime: string
    endTime: string
    customerName: string
    guestCount: number
    restaurantTable: Table // Change to table id only later
}

// Creation payload matches ReservationRequest DTO
export type CreateReservationPayload = {
    tableId: number
    customerName: string
    guestCount: number
    startTime: string   // ISO datetime, e.g. 2026-03-10T19:00:00
  }