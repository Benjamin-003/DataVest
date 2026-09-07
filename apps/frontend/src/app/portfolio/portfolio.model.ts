export interface Position {
  id:           string;
  symbol:       string;
  name:         string;
  quantity:     number;
  buyPrice:     number;
  currentPrice: number | null;
  value:        number | null;
  cost:         number;
  pnl:          number | null;
  pnlPercent:   number | null;
  createdAt:    string;
}

export interface AddPositionPayload {
  symbol:   string;
  name:     string;
  quantity: number;
  buyPrice: number;
}