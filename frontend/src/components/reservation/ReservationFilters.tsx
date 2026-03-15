import { TableZone, type TableZone as TableZoneType } from "@/types/Table"
import { Preference, type Preference as PreferenceType } from "@/types/Preference"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    people: number
    setPeople: (v: number) => void
    zone: TableZoneType
    setZone: (v: TableZoneType) => void
    preference: PreferenceType | ""
    setPreference: (v: PreferenceType | "") => void
    date: string
    setDate: (v: string) => void
    startTime: string
    setStartTime: (v: string) => void
    endTime: string
    setEndTime: (v: string) => void
}

// Component to display filters for the table reservations
export function ReservationFilters({
    people,
    setPeople,
    zone,
    setZone,
    preference,
    setPreference,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
}: Props) {
    const preferenceValue = preference || "NONE"

    return (
        <div className="mb-6 flex flex-col items-start gap-4">
            <div className="flex flex-wrap items-center gap-4">
                <p className="w-56 text-left">Date:</p>
                <Input
                    type="date"
                    className="w-48"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <p className="w-56 text-left">Start Time of Reservation:</p>
                <Input
                    type="time"
                    step={900} // 900 seconds = 15 minutes
                    className="w-48"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <p className="w-56 text-left">End Time of Reservation:</p>
                <Input
                    type="time"
                    step={900} // 900 seconds = 15 minutes
                    className="w-48"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <p className="w-56 text-left">Number of Guests:</p>
                <Input
                    type="number"
                    min={1}
                    className="w-18"
                    placeholder="People"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <p className="w-56 text-left">Zone & Preference:</p>
                <div className="flex flex-wrap items-center gap-4">
                    <Select value={zone} onValueChange={setZone}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TableZone.ALL}>All</SelectItem>
                            <SelectItem value={TableZone.INDOOR}>Indoor</SelectItem>
                            <SelectItem value={TableZone.TERRACE}>Terrace</SelectItem>
                            <SelectItem value={TableZone.PRIVATE_ROOM}>Private room</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={preferenceValue} onValueChange={(value) => setPreference(value === "NONE" ? "" : value as PreferenceType)}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="No preferences" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NONE">No preferences</SelectItem>
                            <SelectItem value={Preference.WINDOW}>Near window</SelectItem>
                            <SelectItem value={Preference.PRIVATE}>Private room</SelectItem>
                            <SelectItem value={Preference.NEAR_PLAY_AREA}>Near play area</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
