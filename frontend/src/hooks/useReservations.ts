import { useEffect, useState } from "react"
import type { Reservation } from "@/types/Reservation"
import { getAllReservations } from "@/api/reservationsApi"

// A custom hook that loads reservations for a given date
// Theyre fetched once the component mounts
// export function useReservations(date: string) {
//     const [reservations, setReservations] = useState<Reservation[]>([])

//     useEffect(() => {
//         if (!date) return

//         getReservations(date).then(setReservations)
//     }, [date])

//     return reservations
// }

// Temporarily get all reservations regardless of date
export function useReservations(date: string) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    useEffect(() => {
        getAllReservations().then(setReservations)
    }, [date])

    return reservations
}