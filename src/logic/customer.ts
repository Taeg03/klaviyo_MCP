export interface Customer {
    id: string;
    name: string;
    email: string;
    region: string;
    lifetimeValue: number;
    lastOrderDaysAgo: number;
    favoriteCategory: string;
    lastOrderDate?: string;
    lastOrderValue?: number;
    oftenBuysOnSale?: boolean;
}

export interface CampaignDraft {
    subjectLine: string;
    body: string;
    channel: 'email' | 'sms';
    targetSegment: string;
    personalizedVariants?: {
        email: string;
        name: string;
        subjectLine: string;
        body: string;
        rationale?: string;
    }[];
}
