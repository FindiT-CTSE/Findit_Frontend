const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:4005';

export const CORE_API_BASE_URL = `${GATEWAY_URL}/api/core`;
export const MATCHING_API_BASE_URL = `${GATEWAY_URL}/api/matching`;
export const CLAIMS_API_BASE_URL = `${GATEWAY_URL}/api/claims`;
export const NOTIFICATIONS_API_BASE_URL = `${GATEWAY_URL}/api/notifications`;
