import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const API_URL = "http://13.61.23.60/info";

// Type for website info response
export interface WebsiteInfoResponse {
  id: number;
  phone: string;
  address: string;
  time: string;
  telegram_link: string;
  instagram_link: string;
}

// Type for updating website info
export interface UpdateWebsiteInfoData {
  phone?: string;
  address?: string;
  time?: string;
  telegram_link?: string;
  instagram_link?: string;
}

// Fetch website info
export const useWebsiteInfo = () => {
  const [cookies] = useCookies(["accessToken"]);
  
  return useQuery({
    queryKey: ["websiteInfo"],
    queryFn: async (): Promise<WebsiteInfoResponse[]> => {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${cookies.accessToken || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch website info");
      }
      
      return response.json();
    },
  });
};

// Add website info (POST)
export const useAddWebsiteInfo = () => {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateWebsiteInfoData): Promise<WebsiteInfoResponse> => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.accessToken || ''}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add website info");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the websiteInfo query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["websiteInfo"] });
    },
  });
};

// Update website info (PATCH)
export const useUpdateWebsiteInfo = () => {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateWebsiteInfoData): Promise<WebsiteInfoResponse> => {
      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.accessToken || ''}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update website info");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the websiteInfo query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["websiteInfo"] });
    },
  });
};