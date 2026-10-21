export type PreviewAsset = {
  symbol: string;
  name: string;
  category: string;
};

export const PREVIEW_ASSETS: readonly PreviewAsset[] = [
  { symbol: "BTC", name: "Bitcoin", category: "Layer 1" },
  { symbol: "ETH", name: "Ethereum", category: "Smart contracts" },
  { symbol: "SOL", name: "Solana", category: "Smart contracts" },
  { symbol: "ADA", name: "Cardano", category: "Smart contracts" },
  { symbol: "LINK", name: "Chainlink", category: "Oracle" },
  { symbol: "AVAX", name: "Avalanche", category: "Layer 1" },
  { symbol: "XRP", name: "XRP", category: "Payments" },
  { symbol: "DOT", name: "Polkadot", category: "Interoperability" },
];
// Static names/categories are for UI demonstration, not provider rankings or live quotes.
