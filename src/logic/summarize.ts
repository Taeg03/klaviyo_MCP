import { Customer } from './customer';

export function calculateAverageLTV(customers: Customer[]): number {
    if (!customers.length) return 0;
    const total = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
    return parseFloat((total / customers.length).toFixed(2));
}

export function summarizeRegionBreakdown(customers: Customer[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    for (const c of customers) {
        breakdown[c.region] = (breakdown[c.region] || 0) + 1;
    }
    return breakdown;
}
