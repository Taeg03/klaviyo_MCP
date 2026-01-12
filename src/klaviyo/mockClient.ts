import { Customer } from '../logic/customer';

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', region: 'NY', lifetimeValue: 1200, lastOrderDaysAgo: 5, favoriteCategory: 'Shoes', lastOrderDate: '2025-12-25', lastOrderValue: 150, oftenBuysOnSale: false },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', region: 'CA', lifetimeValue: 850, lastOrderDaysAgo: 45, favoriteCategory: 'Electronics', lastOrderDate: '2025-11-15', lastOrderValue: 200, oftenBuysOnSale: true },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', region: 'NY', lifetimeValue: 200, lastOrderDaysAgo: 120, favoriteCategory: 'Books', lastOrderDate: '2025-08-30', lastOrderValue: 40, oftenBuysOnSale: true },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', region: 'TX', lifetimeValue: 3000, lastOrderDaysAgo: 2, favoriteCategory: 'Jewelry', lastOrderDate: '2025-12-28', lastOrderValue: 500, oftenBuysOnSale: false },
    { id: '5', name: 'Evan Wright', email: 'evan@example.com', region: 'NY', lifetimeValue: 50, lastOrderDaysAgo: 200, favoriteCategory: 'Shoes', lastOrderDate: '2025-06-10', lastOrderValue: 50, oftenBuysOnSale: true },
    { id: '6', name: 'Fiona Gallagher', email: 'fiona@example.com', region: 'FL', lifetimeValue: 600, lastOrderDaysAgo: 30, favoriteCategory: 'Apparel', lastOrderDate: '2025-11-30', lastOrderValue: 120, oftenBuysOnSale: false },
    { id: '7', name: 'George Miller', email: 'george@example.com', region: 'CA', lifetimeValue: 1500, lastOrderDaysAgo: 10, favoriteCategory: 'Electronics', lastOrderDate: '2025-12-20', lastOrderValue: 300, oftenBuysOnSale: false },
    { id: '8', name: 'Hannah Lee', email: 'hannah@example.com', region: 'TX', lifetimeValue: 450, lastOrderDaysAgo: 60, favoriteCategory: 'Apparel', lastOrderDate: '2025-10-30', lastOrderValue: 80, oftenBuysOnSale: true },
];

export const MockKlaviyoClient = {
    getTopCustomers: async (params: { region?: string; limit?: number }) => {
        let filtered = MOCK_CUSTOMERS;
        if (params.region) {
            filtered = filtered.filter(c => c.region.toLocaleLowerCase() === params.region?.toLocaleLowerCase());
        }
        return filtered
            .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
            .slice(0, params.limit || 5);
    },

    getCustomersByLastOrder: async (params: { minDays: number }) => {
        return MOCK_CUSTOMERS.filter(c => c.lastOrderDaysAgo >= params.minDays);
    },

    summarizeByCategory: async (params: { category: string }) => {
        const matched = MOCK_CUSTOMERS.filter(c => c.favoriteCategory.toLocaleLowerCase() === params.category.toLocaleLowerCase());
        const totalRevenue = matched.reduce((sum, c) => sum + c.lifetimeValue, 0);
        return {
            category: params.category,
            count: matched.length,
            totalRevenue,
            averageLTV: matched.length ? totalRevenue / matched.length : 0
        };
    }
};
