import { api } from "./client"
import type { Recommendation } from "@/types/Recommendation"

// Function to get a recommendation of a table for a given date, time, people and zone
export const getRecommendation = async (params: {
    date: string
    time: string
    people: number
    zone?: string
}): Promise<Recommendation> => {
    const result = await api.get("/recommendation", { params })
    return result.data
}