import { CampaignDraft } from './customer';

export function generateCampaignDraft(
    segmentDescription: string,
    goal: string,
    channel: 'email' | 'sms'
): CampaignDraft {
    let subject = '';
    let body = '';

    if (channel === 'sms') {
        subject = 'N/A (SMS)';
        body = `Hey [Name]! ${goal} Just for our favorite shoppers in ${segmentDescription}: use code VIP20 for 20% off. Shop now: bit.ly/shop`;
    } else {
        subject = `Exclusive Offer for ${segmentDescription}: ${goal}`;
        body = `Hi [Name],\n\nWe noticed you belong to our special group: ${segmentDescription}.\n\nOur goal involves: ${goal}.\n\nAs a thank you, here is a special discount just for you.\n\nBest,\nThe Team`;
    }

    return {
        subjectLine: subject,
        body: body,
        channel,
        targetSegment: segmentDescription
    };
}
