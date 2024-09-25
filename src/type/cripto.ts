export interface CriptoResponse {
  id: string;
  id_coin: number;
  name: string;
  symbol: string;
  rank: number;
  favoriteId?: string[]; // Specify type for optional property
  history: History[];
}

export interface AxiosResponseCoins {
  filter: CriptoResponse[];
  count: number;
}

export interface History {
  id: string;
  price: number;
  circulating_supply: number;
  coinsId: number;
  date: string; // Change to string if received as ISO date string
  market_cap: number;
  market_cap_dominance: number;
  max_supply: number;
  percent_change_1h: number;
  percent_change_7d: number;
  percent_change_24h: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  total_supply: number;
  volume_24h: number; // Fix typo: "valume" to "volume"
  volume_change_24h: number;
}