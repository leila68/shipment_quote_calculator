// const API_BASE_URL = '/api';
// This will use VITE_API_URL in production, /api in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL); // For debugging

export interface QuoteRequest {
  originCity: string;
  destinationCity: string;
  equipmentType: 'dry_van' | 'reefer' | 'flatbed';
  totalWeight: number;
  pickupDate: string;
}

export interface Quote {
  id: number;
  origin_city: string;
  destination_city: string;
  equipment_type: string;
  total_weight: number;
  pickup_date: string;
  base_rate: number;
  equipment_multiplier: number;
  weight_surcharge: number;
  total_quote: number;
  created_at: string;
}

export const api = {
  async createQuote(data: QuoteRequest): Promise<Quote> {
    const response = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create quote');
    }
    
    const result = await response.json();
    return result.quote;
  },

  async getQuotes(filters?: {
    equipmentType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
  }): Promise<{ data: Quote[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters?.equipmentType) params.append('equipmentType', filters.equipmentType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await fetch(`${API_BASE_URL}/quotes?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    
    return response.json();
  },

  async getLanes() {
    const response = await fetch(`${API_BASE_URL}/quotes/meta/lanes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch lanes');
    }
    
    return response.json();
  }
};