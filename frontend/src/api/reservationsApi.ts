import { api } from "./client"
import type { Reservation } from "@/types/Reservation"

// Function to find all reservations for a given date
export const getReservations = async (date: string): Promise<Reservation[]> => {
    const result = await api.get("/reservations", {
    params: { date },
  })
  return result.data
}

// Function to create a new reservation
export const createReservation = async (data: Partial<Reservation>) => {
  const result = await api.post("/reservations", data)
  return result.data
}