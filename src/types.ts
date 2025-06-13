export interface CurrencyResponse {
    success: boolean;
    quotes: Record<string, number>;
    source: string;
    timestamp: number;
  }
  