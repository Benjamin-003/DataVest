export type Range = '1d' | '5d' | '1mo' | '1y';

export interface PricePoint {
  timestamp: number;
  price:     number;
}

export const RANGE_LABELS: Record<Range, string> = {
  '1d':  '1 jour',
  '5d':  '1 semaine',
  '1mo': '1 mois',
  '1y':  '1 an',
};