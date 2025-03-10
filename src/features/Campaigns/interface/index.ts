export interface ICampaignData {
  id: string;
  name: string;
  platform: string;
  icon: string;
  country: string;
  flag: string;
  estimateRevenueUSD: number;
  estimateRevenue: string;
  totalCostUSD: number;
  totalCostINR: string;
  netUSD: number;
  percentage: number;
  lastBidINR: string;
  currentBidINR: string;
  chartData: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  campaigns: ICampaignsList;
}

export interface ICampaignsList {
  totalCost: number;
  data: { campaign: string; cost: number }[];
}
