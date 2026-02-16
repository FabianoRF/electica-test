# Campaign Budget Distribution Tool

A tool for campaign managers to quickly determine optimal budget distribution across advertising channels (Video, Display, Social) based on different optimization strategies.

## Assumptions Made

**Channels & CPM Values:**

- Video: $24 CPM (high cost, high engagement)
- Display: $12 CPM (medium cost, balanced reach)
- Social: $4.50 CPM (low cost, broad reach)

These values are based on typical industry ranges. The architecture uses a `CpmProvider` interface, so they can be easily changed or fetched from an external source.

**Distribution Algorithm:**
Weight-based allocation where each strategy has predefined weights per channel. Estimated reach is calculated as `(budgetAllocated / CPM) * 1000`. This is a simplified model - real-world scenarios would involve more complex optimization (diminishing returns, audience overlap, etc.).

**Strategies:**

- **Maximize Reach**: Social-heavy (60% Social, 30% Display, 10% Video)
- **Balanced**: Equal distribution (~33% each)
- **Maximize Engagement**: Video-heavy (60% Video, 30% Display, 10% Social)

**Data Persistence:**
In-memory storage with a repository interface. Entity structure (`Campaign`) is ready for database integration.

**UI/UX:**
Simple form with budget/days inputs, 3 strategy cards with pie charts, CSV export, and campaign creation modal. Used blue color scheme inspired by Electica branding.

## Decisions Postponed / Left Flexible

- **Database**: In-memory for now. The `CampaignRepository` interface allows swapping to PostgreSQL, MongoDB, etc.
- **Authentication**: Not implemented. Would add JWT/OAuth for production.
- **CPM Source**: Hardcoded. Could fetch from external API or database.
- **Additional Channels**: Only 3 channels. Adding more requires updating enums and providers.
- **Campaign Persistence Details**: Basic entity with name only. Would expand to include strategy, budget, dates, etc.

## What I Would Do Differently With More Time

- Add comprehensive e2e tests
- Implement real database persistence (PostgreSQL)
- Add historical campaign comparison
- Implement user authentication
- Add input validation feedback on frontend
- Create admin panel to manage CPM rates and strategies
- Add real-time collaboration features
- Implement A/B testing for strategies
- Add more detailed reach projections with confidence intervals

## How to Run

### Prerequisites

- Node.js 18+
- npm

### Installation & Running

From project root:

```bash
# Install all dependencies (backend + frontend)
npm install
npm run install:all

# Run both backend and frontend concurrently
npm run dev
```

Or run separately:

```bash
# Backend only (port 3000)
npm run start:backend

# Frontend only (port 4200)
npm run start:front
```

Access the application at `http://localhost:4200`

### Running Tests

Run backend unit tests:

```bash
# From project root
npm run test:backend

# Or from backend directory
cd electica-test-back-end
npm test
```

## API Endpoints

| Method | Endpoint                                      | Description                                |
| ------ | --------------------------------------------- | ------------------------------------------ |
| GET    | `/campaign/distribution?totalBudget=X&days=Y` | Get budget distribution for all strategies |
| POST   | `/campaign`                                   | Create a new campaign `{ name: string }`   |
| GET    | `/campaign/export`                            | Export all created campaigns as CSV        |

## Future Scalability

### Multiple Strategies

The `StrategyProvider` interface allows adding new strategies without changing core logic:

```typescript
// Create new provider or extend existing one
export class DatabaseStrategyProvider implements StrategyProvider {
  getStrategies() {
    // Fetch from database
  }
}
```

Then swap in `campaigns.module.ts`:

```typescript
{ provide: STRATEGY_PROVIDER, useClass: DatabaseStrategyProvider }
```

### Additional Marketing Types

Add new channel types to `ChannelType` enum and update CPM/Strategy providers. The architecture supports any number of channels.

### Database Integration

1. Create a new repository implementing `CampaignRepository`:

```typescript
export class PostgresCampaignRepository implements CampaignRepository {
  // Implement create, findAll, findById with real DB calls
}
```

2. Swap in module:

```typescript
{ provide: CAMPAIGN_REPOSITORY, useClass: PostgresCampaignRepository }
```

The entity structure (`Campaign`) is already designed to be ORM-compatible.

### Scaling for Production

- Add Redis for caching CPM rates and strategy configurations
- Use environment variables for all configurable values
- Add rate limiting and request validation
- Implement proper error handling and logging
- Add health checks and monitoring endpoints
- Containerize with Docker for easy deployment
