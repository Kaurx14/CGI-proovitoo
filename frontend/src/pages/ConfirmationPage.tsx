import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

// Here we want to display the info of the booking
// Table nr/id, num of peeps, time etc. 
const ConfirmationPage = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Confirmation Page</h1>
            <h1>Reservation confirmed!</h1>
            <div className="m-6" >
                    <Button size="lg" variant="default" onClick={() => navigate("/")}>
                        Return to Home Page
                    </Button>
                </div>
        </div>
    )
}

export default ConfirmationPage;
