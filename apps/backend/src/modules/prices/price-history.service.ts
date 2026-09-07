import { AppError } from '../../middleware/error.middleware';

export type Range = '1d' | '5d' | '1mo' | '1y';

interface PricePoint {
  timestamp: number;
  price:     number;
}

const intervalMap: Record<Range, string> = {
  '1d':  '5m',
  '5d':  '1h',
  '1mo': '1d',
  '1y':  '1wk',
};

export const priceHistoryService = {

  async getHistory(symbol: string, range: Range): Promise<PricePoint[]> {
    const interval = intervalMap[range];
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      throw new AppError(404, `Symbole ${symbol} introuvable`);
    }

    const data = await response.json() as any;
    const result = data?.chart?.result?.[0];

    if (!result) {
      throw new AppError(404, `Données introuvables pour ${symbol}`);
    }

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[]     = result.indicators?.quote?.[0]?.close ?? [];

    // Combine timestamps et prix en filtrant les valeurs nulles
    return timestamps
      .map((ts, i) => ({ timestamp: ts * 1000, price: closes[i] }))
      .filter(point => point.price !== null && point.price !== undefined);
  },
};