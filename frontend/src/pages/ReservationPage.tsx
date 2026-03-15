import { useEffect, useState } from "react"
import { useTables } from "@/hooks/useTables"
import { useReservationStore } from "@/store/reservationStore"
import { ReservationFilters } from "@/components/reservation/ReservationFilters"
import { FloorPlan } from "@/components/floorplan/FloorPlan"
import { TableZone, type Table, type TableZone as TableZoneType } from "@/types/Table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function getDefaultDateTime() {
    const now = new Date()
    const intervalMs = 15 * 60 * 1000 // 15 minutes
    const roundedMs = Math.ceil(now.getTime() / intervalMs) * intervalMs
    const rounded = new Date(roundedMs)
  
    const yyyy = rounded.getFullYear()
    const mm = String(rounded.getMonth() + 1).padStart(2, "0")
    const dd = String(rounded.getDate()).padStart(2, "0")
    const hh = String(rounded.getHours()).padStart(2, "0")
    const min = String(rounded.getMinutes()).padStart(2, "0")
  
    return {
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
    }
}

function buildIsoDateTime(date: string, time: string): string {
    // date: YYYY-MM-DD, time: HH:mm
    return `${date}T${time}:00`
}

function addHoursToTime(time: string, hours: number): string {
    // time: "HH:mm"
    const [h, m] = time.split(":").map(Number)
    const d = new Date(0) // epoch
    d.setUTCHours(h, m, 0, 0)
    d.setUTCHours(d.getUTCHours() + hours)
    const hh = String(d.getUTCHours()).padStart(2, "0")
    const mm = String(d.getUTCMinutes()).padStart(2, "0")
    return `${hh}:${mm}`
  }

// Main page for reserving a table
export default function ReservationPage() {

    // Load the tables
    const tables = useTables()
    const navigate = useNavigate()

    // State for reservation filters
    // Perhaps save to local storage?
    const [date, setDate] = useState(() => getDefaultDateTime().date)
    const [startTime, setStartTime] = useState(() => getDefaultDateTime().time)
    const [endTime, setEndTime] = useState(() => addHoursToTime(getDefaultDateTime().time, 2)) // By default 2 hours
    const [people, setPeople] = useState(2)
    const [zone, setZone] = useState<TableZoneType | "">("")

    //const reservations = useReservations(date)
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

    useEffect(() => {
        const startIso = buildIsoDateTime(date, startTime)
        const endIso = buildIsoDateTime(date, endTime)
      
        setStoreDate(date)
        fetchAll(startIso, endIso)
        fetchRecommendedTable(people, startIso, endIso, zone || undefined)
      }, [date, startTime, endTime, people, zone, setStoreDate, fetchAll, fetchRecommendedTable])

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
            })
         
            handleCloseDialog()
            navigate("/confirmation")

        } finally {
          setIsSubmitting(false)
        }
      }

    return (
    <div className="p-6">

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
            date={date}
            setDate={setDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
        />
        <div className="mb-5 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm">
            <p className="text-slate-700">
                <span className="font-semibold text-red-600">Red tables</span> are already reserved for the selected period.
            </p>
            <p className="text-slate-700">
                <span className="font-semibold text-green-600">Green tables</span> are the current recommendation for your group.
            </p>
            {zone && zone !== TableZone.ALL && (
                <p className="text-slate-700">
                    Only tables in the <span className="font-semibold">{zone === TableZone.PRIVATE_ROOM ? "private room" : zone.toLowerCase()}</span> zone can be selected.
                </p>
            )}
        </div>

        <FloorPlan
            tables={tables}
            reservedTableIds={reservedTableIds}
            onTableClick={handleTableClick}
            adminMode={adminMode}
            activeZone={zone}
        />

        {isBookingOpen && selectedTable && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
                <h2 className="text-xl font-semibold">
                    Book Table {selectedTable.id}
                </h2>

                <p className="text-sm text-gray-600">
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
