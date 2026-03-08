import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">

      <h1 className="text-4xl font-bold">
        Welcome to our restaurant!
      </h1>

      <Button size="lg" variant="default" onClick={() => navigate("/reserve")}>
        Book a Table
      </Button>

    </div>
  )
}