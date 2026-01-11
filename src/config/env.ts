import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
    KLAVIYO_API_KEY: process.env.KLAVIYO_API_KEY,
    USE_MOCK_KLAVIYO: process.env.USE_MOCK_KLAVIYO === 'false' ? false : true, // Default to true
    PORT: process.env.PORT || 3000,
    OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'mistral:7b-instruct',
};

console.log('Environment loaded:', {
    mockMode: ENV.USE_MOCK_KLAVIYO,
    hasKey: !!ENV.KLAVIYO_API_KEY
});
