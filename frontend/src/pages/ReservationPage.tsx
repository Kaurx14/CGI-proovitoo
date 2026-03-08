import { useState } from "react"
import { useTables } from "@/hooks/useTables"
import { useReservations } from "@/hooks/useReservations"
import { ReservationFilters } from "@/components/reservation/ReservationFilters"
import { FloorPlan } from "@/components/floorplan/FloorPlan"


// Main page for reserving a table
export default function ReservationPage() {

    // Load the tables
    const tables = useTables()

    // State for reservation filters
    // Perhaps save to local storage?
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [people, setPeople] = useState(2)
    const [zone, setZone] = useState("")

    const reservations = useReservations(date)

    return (
    <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
            Reserve a Table
        </h1>

        <ReservationFilters
            people={people}
            setPeople={setPeople}
            zone={zone}
            setZone={setZone}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
        />

        <FloorPlan
            tables={tables}
            reservations={reservations}
        />
    </div>
    )
}