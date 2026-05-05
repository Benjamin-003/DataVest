export type AssetType = 'STOCK' | 'CRYPTO' | 'COMMODITY' | 'INDEX' | 'FOREX';

export interface WatchlistItem {
  id:        string;
  symbol:    string;
  name:      string;
  type:      AssetType;
  createdAt: string;
}

export interface AddWatchlistItemPayload {
  symbol: string;
  name:   string;
  type:   AssetType;
}