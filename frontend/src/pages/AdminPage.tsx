import { FloorPlan } from "@/components/floorplan/FloorPlan"
import { useTables } from "@/hooks/useTables"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

// Kas ka broneeringute tühistamine? Või jätta tühistamine kasutajatele?
const AdminPage = () => {
    const tables = useTables()
    const navigate = useNavigate()

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Admin Floor Plan</h1>
                <div className="m-6" >
                    <Button size="lg" variant="default" onClick={() => navigate("/")}>
                        Return to Home Page
                    </Button>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Drag tables to update the restaurant layout.
                </p>
            </div>

            <FloorPlan
                tables={tables}
                reservedTableIds={[]}
                adminMode={true}
            />
        </div>
    )
}

export default AdminPage;
