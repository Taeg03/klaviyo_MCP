import { Customer } from '../logic/customer';

export interface KlaviyoClientInterface {
    getTopCustomers(params: { region?: string; limit?: number }): Promise<Customer[]>;
    getCustomersByLastOrder(params: { minDays: number }): Promise<Customer[]>;
    summarizeByCategory(params: { category: string }): Promise<{
        category: string;
        count: number;
        totalRevenue: number;
        averageLTV: number;
    }>;
}
