/**
 * Design API Service Switcher
 * Layer 5: Flexible service routing based on environment
 *
 * Routes to either mock or real API service depending on VITE_USE_MOCK_DATA
 * This allows seamless switching between development and production modes
 */

import { DesignService } from "./design.service";
import { designMockService } from "./design.mock";

// Environment-based service selection
const useMock = import.meta.env.VITE_USE_MOCK_DATA === "true";

/**
 * Design API Service - Unified interface for design operations
 * Automatically routes to mock or real service based on environment variable
 */
export const designAPI = useMock ? designMockService : DesignService;

// Re-export for direct service access if needed
export { DesignService };
export { designMockService };
