import axios from 'axios'; // For future use
import { KlaviyoClientInterface } from './interface';
import { Customer } from '../logic/customer';
import { ENV } from '../config/env';

export const RealKlaviyoClient: KlaviyoClientInterface = {
    getTopCustomers: async (params) => {
        // TODO: Implement real API call
        console.warn("RealKlaviyoClient.getTopCustomers is not implemented yet. Returning empty list.");
        // Example: 
        // const response = await axios.get(`${ENV.KLAVIYO_BASE_URL}/profiles`, { headers: ... });
        return [];
    },

    getCustomersByLastOrder: async (params) => {
        console.warn("RealKlaviyoClient.getCustomersByLastOrder is not implemented yet.");
        return [];
    },

    summarizeByCategory: async (params) => {
        console.warn("RealKlaviyoClient.summarizeByCategory is not implemented yet.");
        return { category: params.category, count: 0, totalRevenue: 0, averageLTV: 0 };
    }
};
