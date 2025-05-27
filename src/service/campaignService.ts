import axios from "axios";
import Cookies from "js-cookie";
// Base API configuration
const api = axios.create({
  baseURL: "https://taseer-b.onrender.com/api", // Adjust based on your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt");
    if (token) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Campaign service functions
export const campaignService = {
  // Get all recommended campaigns
  getRecommendedCampaigns: async () => {
    try {
      const response = await api.get("/campaigns");
      return response.data;
    } catch (error) {
      console.error("API Error in getRecommendedCampaigns:", error);
      throw error;
    }
  },

  // Get campaigns the user has applied to
  getAppliedCampaigns: async () => {
    try {
      const response = await api.get("/campaigns/applied");
      return response.data;
    } catch (error) {
      console.error("API Error in getAppliedCampaigns:", error);
      throw error;
    }
  },

  // Get saved campaigns
  getSavedCampaigns: async () => {
    try {
      const response = await api.get("/campaigns/applied");
      return response.data;
    } catch (error) {
      console.error("API Error in getSavedCampaigns:", error);
      throw error;
    }
  },

  // Get in-progress campaigns
  getInProgressCampaigns: async () => {
    try {
      const response = await api.get("/campaigns/in-progress");
      return response.data;
    } catch (error) {
      console.error("API Error in getInProgressCampaigns:", error);
      throw error;
    }
  },

  // Get canceled campaigns
  getCanceledCampaigns: async () => {
    try {
      const response = await api.get("/campaigns/canceled");
      return response.data;
    } catch (error) {
      console.error("API Error in getCanceledCampaigns:", error);
      throw error;
    }
  },

  // Apply to a campaign
  applyToCampaign: async (campaignId: string) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/apply`);
      return response.data;
    } catch (error) {
      console.error("API Error in applyToCampaign:", error);
      throw error;
    }
  },

  // Save a campaign
  saveCampaign: async (campaignId: string) => {
    try {
      const response = await api.post(`/campaigns/${campaignId}/save`);
      return response.data;
    } catch (error) {
      console.error("API Error in saveCampaign:", error);
      throw error;
    }
  },

  // Mark a campaign as not interested
  markNotInterested: async (campaignId: string) => {
    try {
      const response = await api.post(
        `/campaigns/${campaignId}/not-interested`
      );
      return response.data;
    } catch (error) {
      console.error("API Error in markNotInterested:", error);
      throw error;
    }
  },
};

export default campaignService;
