import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import type { CategoryType } from "../types/category";

const API_URL = "http://13.61.23.60/category";

export interface CreateCategoryData {
  name: string;
  nameUzb: string;
}


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzUzMzU1MDc5LCJleHAiOjE3NTMzNTg2Nzl9.hTmVt764jahNZz_k1YooMYonjFT387S9r6W74jnkFIA'

// Type for updating a category
export interface UpdateCategoryData {
  id: number;
  name?: string;
  nameUzb?: string;
}

// Fetch all categories
export const useCategories = () => {
  const [cookies] = useCookies(["accessToken"]);
  
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryType[]> => {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      
      return response.json();
    },
  });
};

// Add a new category
export const useAddCategory = () => {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCategoryData): Promise<CategoryType> => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Update a category
export const useUpdateCategory = () => {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateCategoryData): Promise<CategoryType> => {
      const response = await fetch(`${API_URL}/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          nameUzb: data.nameUzb,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Delete a category
export const useDeleteCategory = () => {
  const [cookies] = useCookies(["accessToken"]);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};