import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { priceHistoryService } from './price-history.service';

const fetchMock = vi.fn();

const yahooResponse = (timestamps: number[], closes: (number | null)[]) => ({
  ok: true,
  json: async () => ({
    chart: { result: [{ timestamp: timestamps, indicators: { quote: [{ close: closes }] } }] },
  }),
});

describe('priceHistoryService.getHistory', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return points with timestamps in milliseconds', async () => {
    fetchMock.mockResolvedValue(yahooResponse([1000, 2000], [10.5, 11.5]));

    const result = await priceHistoryService.getHistory('AAPL', '1mo');

    expect(result).toEqual([
      { timestamp: 1_000_000, price: 10.5 },
      { timestamp: 2_000_000, price: 11.5 },
    ]);
  });

  it('should filter out null prices', async () => {
    fetchMock.mockResolvedValue(yahooResponse([1, 2, 3], [10, null, 12]));

    const result = await priceHistoryService.getHistory('AAPL', '1d');

    expect(result).toHaveLength(2);
  });

  it('should build the URL with the range and the matching interval', async () => {
    fetchMock.mockResolvedValue(yahooResponse([1], [1]));

    await priceHistoryService.getHistory('AAPL', '1y');

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('/v8/finance/chart/AAPL');
    expect(calledUrl).toContain('range=1y');
    expect(calledUrl).toContain('interval=1wk');
  });

  it('should throw a 404 when the API responds with an error status', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(priceHistoryService.getHistory('ZZZZ', '1mo')).rejects.toThrow('introuvable');
  });

  it('should throw when the API returns no result', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ chart: { result: null } }) });

    await expect(priceHistoryService.getHistory('AAPL', '1mo')).rejects.toThrow('Données introuvables');
  });

  it('should return an empty list when there is no timestamp', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ chart: { result: [{}] } }),
    });

    await expect(priceHistoryService.getHistory('AAPL', '1mo')).resolves.toEqual([]);
  });

  // Régression sécurité (tssecurity:S7044)
  it('should never let a malicious symbol alter the path or the query string', async () => {
    fetchMock.mockResolvedValue(yahooResponse([1], [1]));

    await priceHistoryService.getHistory('../v7/finance/quote?range=max#', '1mo');

    const calledUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(calledUrl.hostname).toBe('query1.finance.yahoo.com');
    expect(calledUrl.pathname.startsWith('/v8/finance/chart/')).toBe(true);
    expect(calledUrl.searchParams.get('range')).toBe('1mo');
  });
});