import { TableZone, type TableZone as TableZoneType } from "@/types/Table"
import { Preference, type Preference as PreferenceType } from "@/types/Preference"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    people: number
    setPeople: (v: number) => void
    zone: TableZoneType | ""
    setZone: (v: TableZoneType | "") => void
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
    <div className="flex gap-4 flex-wrap mb-6">

        <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />

        <Input
            type="time"
            step={900} // 900 seconds = 15 minutes
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
        />

        {/* Has default of startTime + 2 hours */}
        {/* Also: End time can't be earlier than start time. 
            If user selects an end time earlier than start time, it is automatically
            changed to start time + 1 hour. This ensures that a reservation of a table
            lasts at least 1 hour.
        */}
        <Input
            type="time"
            step={900} // 900 seconds = 15 minutes
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
        />

        <Input
            type="number"
            min={1}
            placeholder="People"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
        />

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
    )
}
