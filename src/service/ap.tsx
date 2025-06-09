import { toast } from "react-toastify"
import Cookies from "js-cookie"

const API_BASE_URL = "https://api.taseer.app/api"

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
    }
    return response.json()
}

// Helper function to make API requests with error handling and toast notifications
const apiRequest = async (endpoint: string, method = "GET", data?: any, customHeaders: Record<string, string> = {}) => {
    const token = Cookies.get("jwt")

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
    }

    if (token) {
        headers["authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
        method,
        headers,
        credentials: "include",
    }

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
        config.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
        const result = await handleResponse(response)
        return result
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        toast.error(errorMessage)
        throw error
    }
}

// Campaign API functions
export const fetchCampaign = (campaignId: string) => {
    return apiRequest(`/campaign/${campaignId}`)
}

export const updateCampaign = (campaignId: string, data: any) => {
    return apiRequest(`/campaigns/${campaignId}`, "PUT", data)
}

export const fetchApplicants = (campaignId: string) => {
    return apiRequest(`/campaigns/${campaignId}/applicants`)
}

export const updateApplicationStatus = (applicationId: string, data: { status: string }) => {
    return apiRequest(`/campaign-applications/${applicationId}`, "PUT", data)
}

// Add more API functions as needed
export const createCampaign = (data: any) => {
    return apiRequest("/campaigns", "POST", data)
}

export const deleteCampaign = (campaignId: string) => {
    return apiRequest(`/campaigns/${campaignId}`, "DELETE")
}

export const applyToCampaign = (campaignId: string, data: any) => {
    return apiRequest(`/campaigns/${campaignId}/apply`, "POST", data)
}
