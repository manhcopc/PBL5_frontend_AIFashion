import { BillingMockService } from "./billing.mock";
import { BillingService } from "./billing.service";

// Flag to toggle between mock and real services
const USE_MOCK_API = false; // Set to false to use real API

export const BillingAPI: typeof BillingService = (
  USE_MOCK_API ? BillingMockService : BillingService
) as typeof BillingService;

export * from "./billing.service";
export * from "./billing.mock";
