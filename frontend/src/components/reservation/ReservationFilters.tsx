import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    people: number
    setPeople: (v: number) => void
    zone: string
    setZone: (v: string) => void
    date: string
    setDate: (v: string) => void
    startTime: string
    setStartTime: (v: string) => void
    endTime: string
    setEndTime: (v: string) => void
}

export function ReservationFilters({
    people,
    setPeople,
    zone,
    setZone,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
}: Props) {
    function convertToISO(date: string) {
        const [day, month, year] = date.split(".")
        return `${year}-${month}-${day}`
      }
      
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

        {/* Should have default of startTime + 2 hours */}
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
                <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="INSIDE">Inside</SelectItem>
                <SelectItem value="TERRACE">Terrace</SelectItem>
                <SelectItem value="PRIATE">Private</SelectItem>
            </SelectContent>
        </Select>

    </div>
    )
}