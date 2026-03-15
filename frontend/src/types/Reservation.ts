// Creation payload matches ReservationRequest DTO in backend
export type CreateReservationPayload = {
    tableId: number
    customerName: string
    guestCount: number
    startTime: string
    endTime: string     
}
