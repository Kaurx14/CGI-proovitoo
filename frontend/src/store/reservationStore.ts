import { create } from "zustand"
import { createReservation, getRecommendedTable, getReservedTableIds } from "@/api/reservationsApi"
import type { Table } from "@/types/Table"
import type { Preference } from "@/types/Preference"


type ReservationStore = {
  //reservations: Reservation[]
  reservedTableIds: number[]
  loading: boolean
  error?: string
  currentDate: string | null
  recommendedTableId: number | null
  fetchRecommendedTable: (
    guests: number,
    startTime: string,
    endTime: string,
    preferences?: Preference[]
  ) => Promise<void>

  // setters
  setDate: (date: string) => void

  // fetching
  fetchAll: (startTime: string, endTime: string) => Promise<void>

  // booking + update
  bookTable: (params: {
    tableId: number
    customerName: string
    guestCount: number
    date: string
    startTime: string
    endTime: string
    restaurantTable: Table
  }) => Promise<void>
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservedTableIds: [],
  loading: false,
  error: undefined,
  currentDate: null,
  recommendedTableId: null,
  fetchRecommendedTable: async (guests, startTime, endTime, preferences) => {
    set({ loading: true, error: undefined })
  
    try {
      const tableId = await getRecommendedTable(guests, startTime, endTime, preferences)
  
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

  bookTable: async ({ tableId, customerName, guestCount, startTime, date, endTime, restaurantTable }) => {
    
    // combine date + time to ISO datetime
    const startDateTime = `${date}T${startTime}`
    // create in backend
    await createReservation({ tableId, customerName, guestCount, startTime: startDateTime, date, endTime, restaurantTable })

    // Now unnecessary since we route the user to confirmation page
    // refresh list (by date if we have one, otherwise all)
    // const { fetchAll } = get()
    //   await fetchAll(startDateTime, endDateTime)
    
  },
}))
