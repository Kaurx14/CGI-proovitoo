import { api } from "./client"
import type { Reservation } from "@/types/Reservation"
import type { Preference } from "@/types/Preference"
import type { TableZone } from "@/types/Table"

// Function to find all reservations for a given date
export const getReservations = async (date: string): Promise<Reservation[]> => {
    const result = await api.get("/reservations", {
    params: { date },
  })
  return result.data
}

// Function to create a new reservation
export const createReservation = async (data: Omit<Reservation, "id">) => {
  const result = await api.post("/reservations", data)
  return result.data
}

// Function to get all reservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  const result = await api.get("/reservations/all")
  return result.data
}

// Function get IDs of the reserved tables, to color them red later
export const getReservedTableIds = async (startTime: string, endTime: string): Promise<number[]> => {
  const result = await api.get("/reservations/overlaps/table-ids", {
    params: { startTime, endTime },
  })
  return result.data
}

export const getRecommendedTable = async (
  guests: number,
  startTime: string,
  endTime: string,
  zone?: TableZone,
  preferences?: Preference[]
): Promise<number | null> => {
  const result = await api.get("/reservations/recommended-table", {
    params: { guests, startTime, endTime, zone, preferences },
  })
  return result.data
}
