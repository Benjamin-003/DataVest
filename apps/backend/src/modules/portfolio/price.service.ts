import { AppError } from '../../middleware/error.middleware';

export const priceService = {

  async getPrice(symbol: string): Promise<number> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
      
      const response = await fetch(url, {
        headers: {
          // Yahoo Finance exige un User-Agent pour ne pas bloquer la requête
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok) {
        throw new AppError(404, `Symbole ${symbol} introuvable`);
      }

      const data = await response.json() as any;
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;

      if (!price) {
        throw new AppError(404, `Prix introuvable pour ${symbol}`);
      }

      return price;
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw new AppError(503, `Impossible de récupérer le prix de ${symbol}`);
    }
  },

  // Récupère plusieurs prix en parallèle
  async getPrices(symbols: string[]): Promise<Record<string, number>> {
    const results = await Promise.allSettled(
      symbols.map(async symbol => ({
        symbol,
        price: await priceService.getPrice(symbol),
      }))
    );

    const prices: Record<string, number> = {};
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        prices[result.value.symbol] = result.value.price;
      }
    });

    return prices;
  },
};