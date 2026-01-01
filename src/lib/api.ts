/**
 * API client for Tip Calculator backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CalculationRequest {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
}

export interface CalculationResponse {
  tipAmount: number;
  totalWithTip: number;
  amountPerPerson: number;
  calculationId?: number;
}

export interface CalculationHistory {
  id: number;
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  tipAmount: number;
  totalWithTip: number;
  amountPerPerson: number;
  createdAt: string;
}

export interface HistoryResponse {
  calculations: CalculationHistory[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Calculate tip and save to history
 */
export async function calculateTip(
  data: CalculationRequest
): Promise<CalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/calculations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to calculate tip');
  }

  return response.json();
}

/**
 * Validate calculation without saving
 */
export async function validateCalculation(
  data: CalculationRequest
): Promise<CalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/calculations/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to validate calculation');
  }

  return response.json();
}

/**
 * Get calculation history
 */
export async function getHistory(
  limit: number = 50,
  offset: number = 0
): Promise<HistoryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/history?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return response.json();
}

/**
 * Get a specific calculation by ID
 */
export async function getCalculation(id: number): Promise<CalculationHistory> {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Calculation not found');
    }
    throw new Error('Failed to fetch calculation');
  }

  return response.json();
}

/**
 * Delete a calculation
 */
export async function deleteCalculation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete calculation');
  }
}

/**
 * Delete all calculations
 */
export async function deleteAllCalculations(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete all calculations');
  }
}

/**
 * Check if backend is available
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

