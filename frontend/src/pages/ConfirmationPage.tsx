import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useReservationStore } from "@/store/reservationStore"

// Here we display the info of the booking
// Table nr, num of peeps, time etc. 
const ConfirmationPage = () => {
    const navigate = useNavigate()
    const reservation = useReservationStore((state) => state.lastConfirmedReservation)

    const preferenceLabel = reservation?.preference === "WINDOW"
        ? "Near window"
        : reservation?.preference === "PRIVATE"
          ? "Private room"
          : reservation?.preference === "NEAR_PLAY_AREA"
            ? "Near play area"
            : "No preferences"

    return (
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Reservation confirmed</h1>
                <p className="text-slate-600">Your booking details are below.</p>
            </div>

            {reservation ? (
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                        <p><span className="font-semibold">Reservation ID:</span> {reservation.id}</p>
                        <p><span className="font-semibold">Name:</span> {reservation.customerName}</p>
                        <p><span className="font-semibold">Table:</span> {reservation.tableId}</p>
                        <p><span className="font-semibold">Guests:</span> {reservation.guestCount}</p>
                        <p><span className="font-semibold">Date:</span> {reservation.date}</p>
                        <p><span className="font-semibold">Start time:</span> {reservation.startTime}</p>
                        <p><span className="font-semibold">End time:</span> {reservation.endTime}</p>
                        <p><span className="font-semibold">Zone:</span> {reservation.zone}</p>
                        <p><span className="font-semibold">Preference:</span> {preferenceLabel}</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-600 shadow-sm">
                    No recent reservation details are available.
                </div>
            )}

            <div className="flex gap-3">
                <Button size="lg" variant="default" onClick={() => navigate("/reserve")}>
                    Make Another Reservation
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                    Return to Home Page
                </Button>
            </div>
        </div>
    )
}

export default ConfirmationPage;
