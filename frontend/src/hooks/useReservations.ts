import { useEffect, useState } from "react"
import type { Reservation } from "@/types/Reservation"
import { getReservations } from "@/api/reservationsApi"

// A custom hook that loads reservations for a given date
// Theyre fetched once the component mounts
export function useReservations(date: string) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    useEffect(() => {
        if (!date) return

        getReservations(date).then(setReservations)
    }, [date])

    return reservations
}