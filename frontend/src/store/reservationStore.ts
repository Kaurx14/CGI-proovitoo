import { create } from "zustand"
import { createReservation, getRecommendedTable, getReservedTableIds } from "@/api/reservationsApi"
import type { Table } from "@/types/Table"
import type { Preference } from "@/types/Preference"
import type { TableZone } from "@/types/Table"

// Represents a reservation that has just been sucessfully created
// Used in confirmation page.
type ConfirmedReservation = {
  id: number
  tableId: number
  customerName: string
  guestCount: number
  date: string
  startTime: string
  endTime: string
  zone: TableZone
  preference: Preference | ""
}

type ReservationStore = {
  reservedTableIds: number[] // tables that are already reserved for the selected period
  loading: boolean
  error?: string
  currentDate: string | null
  recommendedTableId: number | null // backend recommendation
  lastConfirmedReservation: ConfirmedReservation | null // last successfully booked reservation (for confirmation page)
  // Requests a recommended table from the backend
  fetchRecommendedTable: (
    guests: number,
    startTime: string,
    endTime: string,
    zone?: TableZone,
    preferences?: Preference[]
  ) => Promise<void>

  // setters
  setDate: (date: string) => void

  // fetching
  fetchAll: (startTime: string, endTime: string) => Promise<void>

  // creates a reservation and stores confirmation info locally
  bookTable: (params: {
    tableId: number
    customerName: string
    guestCount: number
    date: string
    startTime: string
    endTime: string
    restaurantTable: Table
    preference: Preference | ""
  }) => Promise<void>
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservedTableIds: [],
  loading: false,
  error: undefined,
  currentDate: null,
  recommendedTableId: null,
  lastConfirmedReservation: null,
  fetchRecommendedTable: async (guests, startTime, endTime, zone, preferences) => {
    set({ loading: true, error: undefined })
  
    try {
      const tableId = await getRecommendedTable(guests, startTime, endTime, zone, preferences)
  
      set({ recommendedTableId: tableId })
    } catch (e) {
      set({ error: "Failed to fetch recommended table" })
    } finally {
      set({ loading: false })
    }
  },

  setDate: (date) => set({ currentDate: date }),

  fetchAll: async (startTime, endTime) => {
    set({ loading: true, error: undefined })
    try {
      const data = await getReservedTableIds(startTime, endTime)
      set({ reservedTableIds: data })
    } catch (e) {
      set({ error: "Failed to load reservations" })
    } finally {
      set({ loading: false })
    }
  },

  // Creates a reservation in the backend and stores confirmation details locally
  bookTable: async ({ tableId, customerName, guestCount, startTime, date, endTime, restaurantTable, preference }) => {
    // combine date + time to ISO datetime. Format expected by backend
    const startDateTime = `${date}T${startTime}`
    // create in backend
    const reservation = await createReservation({ tableId, customerName, guestCount, startTime: startDateTime, date, endTime, restaurantTable })

    set({
      lastConfirmedReservation: {
        id: reservation.id,
        tableId,
        customerName,
        guestCount,
        date,
        startTime,
        endTime,
        zone: restaurantTable.zone,
        preference,
      }
    })
  },
}))
