import { useEffect, useState } from "react"
import { useTables } from "@/hooks/useTables"
import { useReservationStore } from "@/store/reservationStore"
import { ReservationFilters } from "@/components/reservation/ReservationFilters"
import { FloorPlan } from "@/components/floorplan/FloorPlan"
import { TableZone, type Table, type TableZone as TableZoneType } from "@/types/Table"
import { type Preference } from "@/types/Preference"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getDefaultDateTime, addHoursToTime, parseTimeToMinutes, buildIsoDateTime, roundTimeToQuarterHour } from "@/utils/timeUtils"
import { useNavigate } from "react-router-dom"

// Main page for reserving a table
export default function ReservationPage() {

    // Load the tables
    const tables = useTables()
    const navigate = useNavigate()
    const [date, setDate] = useState(() => getDefaultDateTime().date)
    const [startTime, setStartTime] = useState(() => getDefaultDateTime().time)
    const [endTime, setEndTime] = useState(() => addHoursToTime(getDefaultDateTime().time, 2)) // By default 2 hours
    const [people, setPeople] = useState(2)
    const [zone, setZone] = useState<TableZoneType>(TableZone.ALL)
    const [preference, setPreference] = useState<Preference | "">("")

    const {
        reservedTableIds,
        setDate: setStoreDate,
        fetchAll,
        fetchRecommendedTable,
        bookTable,
      } = useReservationStore()

    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [customerName, setCustomerName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGuestCountExceeded, setIsGuestCountExceeded] = useState(false)
    const adminMode = false

    // Change start time of reservation
    const handleStartTimeChange = (value: string) => {
        const roundedValue = roundTimeToQuarterHour(value)
        setStartTime(roundedValue)

        if (parseTimeToMinutes(endTime) < parseTimeToMinutes(roundedValue) + 60) {
            setEndTime(addHoursToTime(roundedValue, 1))
        }
    }

    // Change end time of reservation
    // End time can't be earlier than start time. 
    // If user selects an end time earlier than start time, it is automatically
    // changed to start time + 1 hour. This ensures that a reservation of a table
    // lasts at least 1 hour.
    const handleEndTimeChange = (value: string) => {
        const roundedValue = roundTimeToQuarterHour(value)

        if (parseTimeToMinutes(roundedValue) < parseTimeToMinutes(startTime) + 60) {
            setEndTime(addHoursToTime(startTime, 1))
            return
        }

        setEndTime(roundedValue)
    }

    // Reload the tables when user changes filters
    useEffect(() => {
        const startIso = buildIsoDateTime(date, startTime)
        const endIso = buildIsoDateTime(date, endTime)
        const selectedPreferences = preference ? [preference] : undefined
      
        setStoreDate(date)
        fetchAll(startIso, endIso)
        fetchRecommendedTable(
            people,
            startIso,
            endIso,
            zone === TableZone.ALL ? undefined : zone,
            selectedPreferences
        )
    }, [date, startTime, endTime, people, zone, preference, setStoreDate, fetchAll, fetchRecommendedTable])

    // Can not book a table when guest count > table capacity
    useEffect(() => {
        if (selectedTable == null) return

        if (people > selectedTable?.capacity) {
            setIsGuestCountExceeded(true)
        } else {
            setIsGuestCountExceeded(false)
        }
    }, [people, selectedTable])

    const handleTableClick = (table: Table) => {
        setSelectedTable(table)
        setIsBookingOpen(true)
    }

    const handleCloseDialog = () => {
        setIsBookingOpen(false)
        setCustomerName("")
    }

    // Confirm reservation, call backend, navigate to confirmation page
    const handleConfirmReservation = async () => {
        if (!selectedTable || !date || !startTime || !customerName) return
    
        try {
            setIsSubmitting(true) 

            await bookTable({
                tableId: selectedTable.id,
                customerName,
                guestCount: people,
                startTime,
                date,
                endTime,
                restaurantTable: selectedTable,
                preference,
            })
         
            handleCloseDialog()
            navigate("/confirmation")

        } finally {
          setIsSubmitting(false)
        }
      }

    return (
    <div className="p-6 max-w-200">

        <h1 className="text-2xl font-bold mb-6">
            Reserve a Table
        </h1>

        <div className="m-6" >
            <Button size="lg" variant="default" onClick={() => navigate("/admin")}>
                Change to Admin Mode
            </Button>
        </div>
        

        <ReservationFilters
            people={people}
            setPeople={setPeople}
            zone={zone}
            setZone={setZone}
            preference={preference}
            setPreference={setPreference}
            date={date}
            setDate={setDate}
            startTime={startTime}
            setStartTime={handleStartTimeChange}
            endTime={endTime}
            setEndTime={handleEndTimeChange}
        />
        <div className="mb-5 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm">
            <p className="text-slate-700">
                <span className="font-semibold text-red-600">Red tables</span> are already reserved for the selected period.
            </p>
            <p className="text-slate-700">
                <span className="font-semibold text-green-600">Green table</span> is the best table for your group.
            </p>
            {zone !== TableZone.ALL && (
                <p className="text-slate-700">
                    Only tables in the <span className="font-semibold">{zone === TableZone.PRIVATE_ROOM ? "private room" : zone.toLowerCase()}</span> zone can be selected.
                </p>
            )}
            {preference && (
                <p className="text-slate-700">
                    Preference: <span className="font-semibold">{preference === "WINDOW" ? "near window" : preference === "PRIVATE" ? "private room" : "near play area"}</span>.
                </p>
            )}
        </div>

        <div className="min-h-[36rem] h-160 w-full">
            <FloorPlan
                tables={tables}
                reservedTableIds={reservedTableIds}
                onTableClick={handleTableClick}
                adminMode={adminMode}
                activeZone={zone}
            />
        </div>

        {isBookingOpen && selectedTable && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md space-y-4 rounded-lg bg-card p-6 text-card-foreground shadow-lg">
                <h2 className="text-xl font-semibold">
                    Book Table {selectedTable.id}
                </h2>

                <p className="text-sm text-muted-foreground">
                    {selectedTable.capacity} seats · Zone: {selectedTable.zone}
                </p>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Name
                    </label>
                    <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                <div className="space-y-1 text-sm">
                    <p>
                        Date: <span className="font-medium">{date}</span>
                    </p>
                    <p>
                        Start time: <span className="font-medium">{startTime}</span>
                    </p>
                    <p>
                        End time: <span className="font-medium">{endTime}</span>
                    </p>
                    <p>
                        Guests: <span className="font-medium">{people}</span>
                    </p>
                    {isGuestCountExceeded && (
                        <p>
                            Guests count exceeded!
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleCloseDialog}
                        disabled={isSubmitting}
                    >
                    Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmReservation}
                        disabled={isSubmitting || !customerName || isGuestCountExceeded}
                    >
                        {isSubmitting ? "Booking..." : "Confirm reservation"}
                    </Button>
                </div>
                </div>
            </div>
            )}
    </div>
    )
}
