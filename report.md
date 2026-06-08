# Development Report: Global Job Watcher & Polling Flow Refactor

## 1. Overview
Updated the frontend polling mechanism for the two long-running AI workflows and moved active job tracking to a global background watcher:

* **Trend analysis:** user submits a project/category request, backend creates an analysis job, frontend polls until the trend/result data is ready.
* **Image generation:** user submits generation settings, backend creates a generation job, frontend polls until generated images are ready.

The goal was to avoid long blocking API waits, standardize task statuses, prevent duplicated polling intervals, keep watching jobs after users close modals or change routes, and make the UI handle `completed`, `failed`, and timeout states more clearly.

## 2. New Shared Job Model

Added a shared job status model:

```ts
type JobType = "trend_analysis" | "image_generation";
type JobStatus = "queued" | "processing" | "completed" | "failed" | "timeout";
```

### New files

* `src/types/job.ts`
  * Defines `JobType`, `JobStatus`, `TrackedJob`, and notification payload types.
* `src/utils/jobStatus.ts`
  * Maps backend statuses such as `PENDING`, `PROCESSING`, `GENERATING_IMAGES`, `COMPLETED`, `FAILED`, `ERROR`, `TIMEOUT` into the normalized `JobStatus`.
* `src/hooks/usePollingJobStatus.ts`
  * Reusable local polling hook retained for isolated use cases.
* `src/store/useJobStore.ts`
  * Zustand store persisted under `active_jobs`, storing active jobs and job notifications.
* `src/components/jobs/GlobalJobWatcher.tsx`
  * App-level background watcher that polls active jobs independently from modal/page lifecycle.

## 3. Global Job Watcher

`GlobalJobWatcher` is mounted inside `UserLayout`, so it stays alive while users navigate between protected user pages.

Behavior:

* Reads running jobs from `useJobStore`.
* Polls all `queued` and `processing` jobs every `3000ms`.
* Avoids duplicate in-flight requests for the same `jobId`.
* Continues polling after modal/page unmount.
* Updates job status, result images, errors, and completion time in global store.
* Creates global notifications for `completed`, `failed`, and `timeout`.
* Shows toast-style notifications with a `Xem kết quả` action when `projectId` is available.
* Stops jobs after `120000ms` timeout.

`Header` now shows:

* Running task badge, for example `2 tasks running`.
* Notification bell count for unread job notifications.

## 4. Polling Hook Behavior

`usePollingJobStatus` supports:

* No polling when `jobId` is missing.
* No duplicated intervals.
* Sequential polling using `setTimeout`, avoiding overlapping API calls.
* Automatic cleanup on unmount.
* Stop polling on `completed`, `failed`, or `timeout`.
* Temporary network error handling with retry count.
* Safe handling when API returns `null`, `undefined`, empty arrays, or missing status fields.

Default behavior:

* `intervalMs`: `3000`
* `timeoutMs`: `120000`
* `maxNetworkErrors`: `3`

## 5. Trend Analysis Flow

Updated `src/hooks/useDesignGeneration.ts`.

New flow:

```txt
User submits trend analysis request
→ frontend calls createTrendAnalysisJob
→ backend returns requestId/jobId + initial status
→ frontend stores job in global useJobStore
→ GlobalJobWatcher polls fetchTrendAnalysisStatus
→ queued/processing: keep polling
→ completed: stop polling, store result images/report, show notification
→ failed: stop polling, show error notification + Retry in local UI if still open
→ timeout: stop polling, show timeout notification
```

Updated `src/components/user/ProjectRequestModal.tsx`:

* Shows a non-crashing status card while analysis is running.
* Shows normalized status label.
* Shows start time if available.
* Shows clear error state.
* Adds `Retry analysis` button.

## 6. Image Generation Flow

Updated `src/hooks/useGenerationFlow.ts`.

New flow:

```txt
User submits image generation settings
→ frontend calls createImageGenerationJob
→ backend returns requestId/jobId + initial status
→ frontend stores job in global useJobStore
→ GlobalJobWatcher polls fetchImageGenerationStatus
→ queued/processing: keep polling
→ completed: stop polling, store generated images, show notification
→ failed: stop polling, show error notification + Retry in local UI if still open
→ timeout: stop polling, show timeout notification
```

Updated `src/pages/Design/CreateDesign.tsx`:

* Removed full-screen blocking loading overlay.
* Added in-page generation status card.
* Added image skeleton placeholders while images are being generated.
* Added failed state with Retry button.
* Local completion toast was removed to avoid duplicate notifications; global watcher now handles completion toast.

## 7. Project Detail Integration

Updated `src/pages/Workspace/ProjectDetail.tsx`:

* Reads tracked image generation jobs from `useJobStore`.
* Merges global job state with backend request history.
* Maps global status into request cards:
  * `queued` -> `PENDING`
  * `processing` -> `GENERATING_IMAGES`
  * `completed` -> `COMPLETED`
  * `failed` / `timeout` -> `FAILED`
* Shows completed job images in the gallery even before a backend refetch catches up.

## 8. Credit Handling

Image generation now avoids repeated credit deduction from polling:

* Polling never consumes credits.
* A request is tracked by `chargedRequestId`.
* Retrying the same request does not deduct credits multiple times.
* Credits are only consumed when starting a generation job for a request that has not been charged yet.

## 9. API Layer Changes

Updated `src/features/analysis/api/index.ts` with clearer job-based methods:

* `createTrendAnalysisJob`
* `fetchTrendAnalysisStatus`
* `createImageGenerationJob`
* `fetchImageGenerationStatus`

The existing methods are still present for compatibility.

Updated `src/features/analysis/api/analysis.mock.ts`:

* Mock trend analysis now progresses through attempts instead of staying pending.
* Mock image generation now returns `PENDING -> PROCESSING -> COMPLETED`.
* Completed mock generation returns generated image URLs.

## 10. Type Safety Updates

Updated:

* `src/features/analysis/analysis.types.ts`
  * Added `PROCESSING`.
  * Added `JobCreateResponse`.
* `src/features/analysis/mappers/analysisMapper.ts`
  * Supports `PROCESSING` status.
* `src/features/admin/types/admin.types.ts`
  * Added compatibility fields for current mock/admin display data.

## 11. Backend Requirements

To fully support the new flow, backend should avoid holding long HTTP requests open. Instead, it should return immediately after creating a job.

### Trend analysis create endpoint

Expected response:

```ts
{
  jobId: string;
  requestId: string;
  status: "queued" | "processing";
  startedAt?: string;
}
```

### Trend analysis status endpoint

Expected response:

```ts
{
  requestId: string;
  status: string;
  result_images?: string[];
  error?: string;
}
```

### Image generation create endpoint

Expected response:

```ts
{
  jobId: string;
  requestId: string;
  status: "queued" | "processing";
  startedAt?: string;
}
```

### Image generation status endpoint

Expected response:

```ts
[
  {
    request_id: string;
    status: string;
    design_image_url?: string[];
    error?: string;
  }
]
```

## 12. Verification

The following checks passed:

```bash
npm run lint
npm run build
```

---

# Development Report: Design Studio Component

## 1. Overview
Implemented the "Design Studio" view as the primary hub for managing and viewing AI-generated fashion designs. Features seamless transitions between empty states, loading overlays, and a grid presentation of results.

## 2. Architecture & Components
* **UI Layer (`src/pages/DesignStudio/DesignStudio.tsx`):** Main layout holding header, stats row, and conditionally rendering child states.
* **Components (`src/components/design/`):** 
  * `LoadingOverlay.tsx`: Full-screen glassmorphism backdrop with pulsing text.
  * `ResultsGrid.tsx`: 3-column responsive grid with interactive 5-star rating system and hover styling.
* **Business Logic & State (`src/hooks/useDesignGeneration.ts`):** Orchestrates finite states (`IDLE`, `LOADING`, `SUCCESS`). Utilizes a 3-second `setTimeout` to accurately simulate AI processing delays.
* **Data Provider (`src/constants/mockResults.ts`):** Supplies fallback image placeholders and titles.

---

# Development Report: Create New Design Component

## 1. Overview
Built the "Create New Design" capability, implementing complex state validation, global credit checks, and staged polling simulations across the generation process.

## 2. Architecture & Implementation
* **UI Layer (`src/pages/Design/CreateDesign.tsx`):** Handled trend selection (horizontal scroll) alongside a sticky sidebar panel for garment category and multi-select style tags.
* **Components (`src/components/ui/`):** `TrendCard.tsx` (single select highlight) and `StyleTag.tsx` (multi-select pill button).
* **Global State (`src/store/UserContext.tsx`):** Implemented an initial context system initialized with 150 credits, cleanly handling the 10-credit deduction upon successful design rendering.
* **Business Logic (`src/hooks/useGenerationFlow.ts`):** Enforces form requirements. Crucially, handles the staged 3-second simulated loading interval mapping: *"CRAWLING" (0s) -> "ANALYZING_AI" (1s) -> "GENERATING" (2s)*.
* **Service Module (`src/services/api.ts`):** Promisified simulated delay.

---

# Development Report: Billing Page Component

## 1. Overview
Created a comprehensive Billing & Pricing page featuring transparent pricing tiers, monthly/annual billing toggle, and interactive pricing cards with feature comparison.

## 2. Architecture & Implementation

### File Structure
* **Main Page (`src/pages/Billing/Billing.tsx`):** Full-page layout integrating header with credit display, pricing cards grid, FAQ accordion section, and enterprise CTA.
* **Components (`src/components/billing/`):**
  * `BillingToggle.tsx`: Interactive toggle switch for monthly/annual billing cycles with "Save 16%" badge.
  * `PricingCard.tsx`: Reusable card component displaying plan details, pricing, credit allocation, features list, and CTA button.

### Data Provider
* **Constants (`src/constants/billingPlans.ts`):** 
  - Defines three pricing tiers: Free Starter ($0), Pro Creator ($29/month, marked as "Most Popular"), and Enterprise (custom pricing).
  - Includes TypeScript interfaces (`BillingCycle`, `PricingPlan`) for type safety.
  - Feature lists for each plan with green checkmark indicators.

### State & Features
* **Global Integration:** Leverages `useUserStore()` from `UserContext` to display current credit balance in the header badge.
* **Billing Toggle Logic:** `useState` hook manages `isAnnual` state, dynamically calculating prices based on billing cycle selection.
* **Responsive Grid:** 3-column pricing card layout using Tailwind (`grid-cols-1 md:grid-cols-3`), with the Pro Creator card scaled up (`lg:scale-105`) when featured.
* **Visual Hierarchy:** 
  - Pro Creator card features purple gradient background, glowing border, and "Most Popular" badge.
  - Free and Enterprise cards use standard dark theme with white text on hover.
  - All CTAs are contextually colored (white for Free/Enterprise, purple for Pro).

### Additional Sections
* **FAQ Section:** 4-card grid addressing common billing questions (plan changes, credit reset, refunds, free trial).
* **Enterprise CTA:** Prominent call-to-action for custom plans with gradient background and contact sales button.
* **Header Integration:** Displays page title "Billing" with user credits badge, notification bell, and avatar placeholder.

## 3. Routing
* **Route Path:** `/billing`
* **Protection:** Integrated into user-protected routes (requires `["user", "admin"]` roles).
* **Layout:** Wrapped with existing `UserLayout` component for sidebar navigation consistency.

## 4. Design Specifications
* **Color Scheme:** Dark theme (zinc-950 background) with purple accents (#9333ea).
* **Typography:** Bold sans-serif with scaled sizing (text-4xl for main heading, text-5xl for prices).
* **Spacing:** Consistent padding (p-8 for cards), gap-8 between sections.
* **Animations:** Smooth transitions (duration-300) on buttons and hover states, including scale-95 on active clicks.
* **Icons:** Lucide React icons (Zap for credits, Check for features, Bell for notifications).

---

## Summary of All Features Implemented (To Date)

### Core Infrastructure
1. **Global State Management** - UserContext with credit system
2. **Role-Based Route Protection** - ProtectedRoute component for user/admin access
3. **Responsive Layouts** - UserLayout and AdminLayout with Sidebar navigation

### User-Facing Pages
1. **Design Studio** - View and rate AI-generated designs
2. **Create New Design** - Multi-step form with trend selection, category, and style tags
3. **Billing** - Pricing comparison with monthly/annual toggle

### Components Library
- Design cards with hover effects
- Loading overlays with glassmorphism
- Pricing cards with feature lists
- Interactive toggle switches
- Style tag multi-select buttons
- Trend cards with selection highlighting

### Business Logic
- 3-second simulated AI processing with step-by-step status messages
- Credit validation and deduction (10 credits per generation)
- Form validation (Trend + Category + Styles required)
- Credit-gated feature access with upgrade prompts

---

# Development Report: Project Detail Page Component

## 1. Overview
Created a comprehensive Project Detail page allowing users to view and manage design requests within a specific project. Features a clean tabbed interface with request history table, status tracking, and navigation back to the workspace.

## 2. Architecture & Implementation

### File Structure
* **Main Page (`src/pages/Workspace/ProjectDetail.tsx`):** Full-page layout with sticky header, tab navigation, and conditional rendering of content sections.
* **Types (`src/types/index.ts`):** Added `DesignRequest` interface extending the existing Project type.
* **Mock Data (`src/constants/mockDesignRequests.ts`):** Predefined array of 6 design requests with varied statuses (Completed, Generating, Pending).

### Key Features

#### Header Section
* **Navigation:** Back to Workspace link in purple (text-purple-500) with arrow icon
* **Title & Subtitle:** 
  - Main: "Summer Collection 2026" (text-4xl font-extrabold)
  - Sub: "View and manage your design requests and assets" (text-zinc-400)
* **CTA Button:** Purple "New Design Request" button (rounded-xl) positioned top-right

#### Tab Navigation
* Two tabs: "Request History" and "Asset Gallery"
* Active tab indicator: Gradient underline (purple-600 to purple-400)
* Smooth tab switching with `useState` hook managing `activeTab` state
* Inactive tabs fade to zinc-500 with hover states

#### Request History Table
* **Grid Layout:** 5-column responsive grid (ID, Category, Target Style, Date, Status)
* **Styling:**
  - Header row: bg-zinc-900/80 with uppercase labels (text-zinc-400)
  - Body rows: Divide with zinc-800/50 borders, hover effect (bg-zinc-800/30)
  - Generous padding (py-6) for readability
* **Status Badge Styling:**
  - **Completed:** bg-emerald-950/40 text-emerald-400 with Check icon
  - **Generating:** bg-sky-950/40 text-sky-400 with Clock icon
  - **Pending:** bg-amber-950/40 text-amber-400 with AlertCircle icon
  - All badges: Rounded-full with border and inline-flex layout

#### Request Data
Mock requests include:
```
REQ-001 | T-Shirts | Minimalist | Apr 8, 2026 | Completed
REQ-002 | Dresses | Vintage | Apr 7, 2026 | Completed
REQ-003 | Jackets | Modern | Apr 6, 2026 | Generating
REQ-004 | Vests | Eco-Friendly | Apr 5, 2026 | Pending
REQ-005 | Polo | Casual | Apr 4, 2026 | Completed
REQ-006 | T-Shirts | Urban Street | Apr 3, 2026 | Completed
```

#### Asset Gallery Tab (Future)
* Placeholder section with message "Gallery Coming Soon"
* Indicates where generated design assets will appear

### Styling Specifications
* **Background:** zinc-950 (dark)
* **Container:** rounded-3xl borders with zinc-800/50
* **Typography:** Bold monospace for request IDs (font-mono, text-purple-400)
* **Transitions:** Smooth hover effects (transition-colors, duration-300)
* **Layout:** Sticky header (top-0 z-20), max-w-7xl constraint for readability

## 3. Routing Integration
* **Route Path:** `/workspace/:projectId`
* **Protection:** Integrated into user-protected routes (requires `["user", "admin"]` roles)
* **Layout:** Uses existing `UserLayout` wrapper for sidebar consistency
* **Import:** Added to App.tsx with ProjectDetail component

## 4. Type Safety
* TypeScript interfaces for `DesignRequest` with union type for status
* Generic status icon and style selector functions using switch statements
* Proper type inference throughout component lifecycle

---

## Summary of All Features Implemented (Updated)

### Core Infrastructure
1. **Global State Management** - UserContext with credit system
2. **Role-Based Route Protection** - ProtectedRoute component for user/admin access
3. **Responsive Layouts** - UserLayout and AdminLayout with Sidebar navigation

### User-Facing Pages
1. **Design Studio** - View and rate AI-generated designs
2. **Create New Design** - Multi-step form with trend selection, category, and style tags
3. **Billing** - Pricing comparison with monthly/annual toggle
4. **Project Detail** - View request history with status tracking and tabbed interface

### Components Library
- Design cards with hover effects
- Loading overlays with glassmorphism
- Pricing cards with feature lists
- Interactive toggle switches
- Style tag multi-select buttons
- Trend cards with selection highlighting
- Data tables with conditional status badges
- Tab navigation with gradient indicators

### Business Logic
- 3-second simulated AI processing with step-by-step status messages
- Credit validation and deduction (10 credits per generation)
- Form validation (Trend + Category + Styles required)
- Credit-gated feature access with upgrade prompts
- Status-based icon and color mapping for requests
- Tab state management for content switching

---

# Development Report: Project Detail Page - Request Cards Refactoring

## 1. Overview
Completely refactored the Project Detail page from a traditional data table layout to a premium visual grid card system. This modernization enhances the user experience with status-specific card designs that align with the fashion tech aesthetic of StyleAI.

## 2. Architecture & Implementation

### Grid Layout System
* **Responsive Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
* Scales from single column on mobile to 4 columns on extra-large screens
* Consistent gap spacing for professional appearance

### Card Component Structure

#### 1. CompletedRequestCard
* **Image Preview Area:** `aspect-[3/4]` container displaying the first design image
* **Hover Effects:** 
  - Image zoom on group-hover (`scale-110`)
  - Download button overlay with fade-in transition
  - Shadow elevation from `shadow-sm` to `shadow-xl`
* **Content Section:**
  - Request ID in monospace (font-mono, text-purple-400)
  - Date display (text-zinc-400, text-xs)
  - Metadata: Category and Target Style with clear labels
  - Emerald status badge with pulsing dot indicator
* **Action Buttons:**
  - "View" button with Eye icon (zinc-800/50 background)
  - "Export" button with Download icon (purple-600/20 background)
  - Both buttons responsive with `active:scale-95`

#### 2. GeneratingRequestCard
* **Visual Indicators:**
  - Pulsing dashed border (`border-2 border-dashed border-sky-500/50 animate-pulse`)
  - Dark gray background (`bg-zinc-900`)
  - Spinning loader icon (`Loader2` with `animate-spin`)
* **Loading Content:**
  - Bold status heading: "⚡ AI RENDERING..." (text-sky-400 font-black)
  - Dynamic loading message integrated with `loadingMessage` prop
  - Sub-text description for real-time progress feedback
* **Action Buttons:**
  - "Cancel" button with close icon (red-950/30 background)
  - "Monitor" button with clock icon (sky-600/20 background)
* **Status Badge:** Animated pulse effect on badge and indicator dot

#### 3. PendingRequestCard
* **Visual Indicators:**
  - Dashed border with amber accents (`border-amber-500/50`)
  - Double pulsing clock icon animation
  - Dark background (`bg-zinc-900`)
* **Queue Content:**
  - Status heading: "⏳ IN QUEUE" (text-amber-400 font-black)
  - Sub-text: "Waiting for AI server availability..."
  - Clear visual distinction from generating state
* **Action Buttons:**
  - "Remove" button (zinc-800/50 background)
  - "Priority" button with AlertCircle icon (amber-600/20 background)

### Component Architecture

#### RequestCard Router
```typescript
function RequestCard({ request, loadingMessage }: RequestCardProps) {
  switch (request.status) {
    case 'Completed':
      return <CompletedRequestCard request={request} />;
    case 'Generating':
      return <GeneratingRequestCard request={request} loadingMessage={loadingMessage} />;
    case 'Pending':
      return <PendingRequestCard request={request} />;
  }
}
```
Centralizes status-based card rendering logic for maintainability and extensibility.

### Data Structure

#### Enhanced DesignRequest Interface
```typescript
interface DesignRequestWithImages extends DesignRequest {
  design_image_url?: string[];
}
```
Allows optional image URL arrays while maintaining backward compatibility with base interface.

#### Mock Data Updates
Each request now includes `design_image_url` array:
- **Completed requests:** Contains real Unsplash image URLs for preview
- **Generating/Pending requests:** Empty arrays (no images yet)

### Styling Specifications

#### Typography
- Request IDs: `font-mono font-bold text-purple-400` (uppercase tracking)
- Dates: `text-xs text-zinc-400`
- Metadata labels: `font-semibold text-zinc-300`
- Status headings: `font-black tracking-wider uppercase`

#### Colors by Status
- **Completed:** Emerald palette (emerald-400, emerald-950/40, emerald-800/50)
- **Generating:** Sky palette (sky-400, sky-950/40, sky-800/50)
- **Pending:** Amber palette (amber-400, amber-950/40, amber-800/50)

#### Transitions & Animations
- Smooth hover effects: `transition-all duration-300` to `duration-500`
- Image zoom: `transition-transform duration-500`
- Button scaling: `active:scale-95`
- Pulsing animations: `animate-pulse` on loading badges and spinners
- Shadow elevation on card hover

#### Spacing & Sizing
- Card padding: `p-4` for content area
- Button gaps: `gap-1.5` for icon-text alignment
- Card height: `h-full` for consistent sizing in grid
- Image aspect ratio: `aspect-[3/4]` (portrait orientation)

## 3. State Management Integration

### Hook Integration
- Leverages existing project ID from URL params (for future API integration)
- Accepts `loadingMessage` prop for real-time status updates
- Card status automatically determines which component variant to render

### Future Enhancement Points
- Connect to actual API for fetching design requests
- Real-time updates for generating status
- User interactions (View, Export, Cancel, Monitor, Priority)
- Image download functionality
- Request deletion and prioritization

## 4. Responsive Design

### Breakpoints
- **Mobile (default):** 1 column (`grid-cols-1`)
- **Small (sm:):** 2 columns (`sm:grid-cols-2`)
- **Large (lg:):** 3 columns (`lg:grid-cols-3`)
- **Extra Large (xl:):** 4 columns (`xl:grid-cols-4`)

### Mobile Optimizations
- Full-width cards on mobile screens
- Optimized button layouts for touch interaction
- Readable typography sizes at all scales
- No horizontal scrolling required

## 5. Key Features & Best Practices

### Premium User Experience
- Visual status indicators through color and animation
- Contextual action buttons for each state
- Smooth transitions and hover effects
- Grid alignment for professional appearance

### Code Quality
- TypeScript interfaces for type safety
- Component composition pattern (CompletedCard, GeneratingCard, PendingCard)
- Router component pattern for status-based rendering
- Proper prop typing with RequestCardProps interface

### Accessibility & Performance
- Semantic HTML structure
- Clear visual hierarchy
- Smooth animations (not distracting)
- Optimized image rendering with lazy loading potential
- Card height consistency using `h-full`

### Design Consistency
- Dark theme maintained (zinc-950 background)
- Rounded corners: `rounded-2xl` for cards
- Border styling: `border-zinc-800/50` for subtle separators
- Icon usage from lucide-react library

---

## Summary of Project Detail Page Evolution

### Before: Traditional Data Table
- 5-column grid layout with headers and rows
- Text-only information display
- Limited visual differentiation
- No status-specific interactions

### After: Premium Visual Cards
- Responsive card grid (1-4 columns)
- Rich image previews with hover effects
- Status-specific visual designs (Completed, Generating, Pending)
- Interactive action buttons with contextual purposes
- Smooth animations and transitions
- Professional fashion tech aesthetic
- Enhanced user engagement through visual hierarchy

### Metrics
- **Cards Per Row:** Scales from 1 to 4 based on viewport
- **Card Height:** Consistent via `h-full` flexbox layout
- **Image Aspect Ratio:** 3:4 (portrait orientation)
- **Animation Duration:** 300-500ms for smooth transitions
- **Color Schemes:** 3 distinct palettes (Emerald, Sky, Amber)
