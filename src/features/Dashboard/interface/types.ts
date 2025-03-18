export interface SummaryCardData {
    title: string;
    value: string;
    icon: React.ComponentType;
    change: string;
    isPositive: boolean;
}

export interface AppData {
    name: string;
    revenue: string;
    installs: string;
    roi: string;
}

export interface CampaignData {
    name: string;
    status: 'active' | 'pending' | 'ended';
    spend: string;
    conversions: string;
    cpa: string;
} 