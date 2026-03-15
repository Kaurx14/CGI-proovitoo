
// The following 5 time-related helper functions are created by AI to ensure correct time format
// with backend. Also to add 2 hours to the start time, when setting end time by default. 
// Initially I struggled with "Bad Requests" to backend and it took me some time to realize that
// the time format that frontend sent did not match what the backend expected
export function getDefaultDateTime() {
    const now = new Date()
    const intervalMs = 15 * 60 * 1000 // 15 minutes
    const roundedMs = Math.ceil(now.getTime() / intervalMs) * intervalMs // allow 15 minute intervals only
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

export function buildIsoDateTime(date: string, time: string): string {
    return `${date}T${time}:00`
}

export function parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

// In the reservation filter, all times can be selected (native input wrapper logic). However
// this function rounds it to the nearest quarter, so we always have 15 minute intervals.
export function roundTimeToQuarterHour(time: string): string {
    const totalMinutes = parseTimeToMinutes(time)
    const roundedMinutes = Math.round(totalMinutes / 15) * 15
    const normalizedMinutes = ((roundedMinutes % (24 * 60)) + (24 * 60)) % (24 * 60)
    const hours = Math.floor(normalizedMinutes / 60)
    const minutes = normalizedMinutes % 60

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export function addHoursToTime(time: string, hours: number): string {
    const [h, m] = time.split(":").map(Number)
    const d = new Date(0) // epoch
    d.setUTCHours(h, m, 0, 0)
    d.setUTCHours(d.getUTCHours() + hours)
    const hh = String(d.getUTCHours()).padStart(2, "0")
    const mm = String(d.getUTCMinutes()).padStart(2, "0")
    return `${hh}:${mm}`
  }
