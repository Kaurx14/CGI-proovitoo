import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    people: number
    setPeople: (v: number) => void
    zone: string
    setZone: (v: string) => void
    date: string
    setDate: (v: string) => void
    time: string
    setTime: (v: string) => void
}

export function ReservationFilters({
    people,
    setPeople,
    zone,
    setZone,
    date,
    setDate,
    time,
    setTime,
}: Props) {
    return (
    <div className="flex gap-4 flex-wrap mb-6">

        <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />

        <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
                <SelectItem value="inside">Inside</SelectItem>
                <SelectItem value="terrace">Terrace</SelectItem>
                <SelectItem value="private">Private</SelectItem>
            </SelectContent>
        </Select>

    </div>
    )
}