import { create } from "zustand";

export type Hotel = {
    id: string;
    name: string;
    rating: number;
    pricePerNight: number;
    rooms: Array<{
      id: string;
      name: string;
    }>;
  };

type HotelStore = {
    hotels: Hotel[];
    totalCount: number;
    loading: boolean;
    error: string | null;
    fetchHotels: (filters?: {
      name?: string;
      rating?: number;
      priceMin?: number;
      priceMax?: number;
      page?: number;
    }) => Promise<void>;
  };

  export const useHotelStore = create<HotelStore>((set) => ({
        hotels: [],
        totalCount: 0,
        loading: false,
        error: null,
        fetchHotels: async (filters = {}) => {
            set({ loading: true, error: null });
            try {
                const params = new URLSearchParams();
                if (filters.name) params.append("name", filters.name);
                if (filters.rating) params.append("rating", String(filters.rating));
                if (filters.priceMin) params.append("priceMin", String(filters.priceMin));
                if (filters.priceMax) params.append("priceMax", String(filters.priceMax));

                params.append("page", String(filters.page || 1));

                const res = await fetch(`/api/hotels?${params.toString()}`);

                if (!res.ok) throw new Error("Error fetching data");
                const data = await res.json();
                set({ hotels: data.hotels, totalCount: data.totalCount, loading: false });
            } catch (error) {
                set({ error: (error instanceof Error ? error.message : "Unknown error"), loading: false });
 
            }

        },

  }));