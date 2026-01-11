export interface Customer {
    id: string;
    name: string;
    email: string;
    region: string;
    lifetimeValue: number;
    lastOrderDaysAgo: number;
    favoriteCategory: string;
}

export interface CampaignDraft {
    subjectLine: string;
    body: string;
    channel: 'email' | 'sms';
    targetSegment: string;
}
