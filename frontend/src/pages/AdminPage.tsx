import { FloorPlan } from "@/components/floorplan/FloorPlan"
import { useTables } from "@/hooks/useTables"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

// Page for admin to relocate their tables
const AdminPage = () => {
    const tables = useTables()
    const navigate = useNavigate()

    return (
        <div className="mx-auto flex min-h-screen w-200 max-w-7xl flex-col gap-6 p-6 place-items-center">
            <div className="space-y-2 ">
                <h1 className="text-3xl font-bold">Admin Floor Plan</h1>
                <div className="m-6" >
                    <Button size="lg" variant="outline" onClick={() => navigate("/reserve")}>
                        Return to Reservation Page
                    </Button>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Drag tables to update the restaurant layout.
                </p>
            </div>

            <div className="h-160 w-full">
                <FloorPlan
                    tables={tables}
                    reservedTableIds={[]}
                    adminMode={true}
                />
            </div>
        </div>
    )
}

export default AdminPage;
