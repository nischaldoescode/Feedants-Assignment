# Feedants Competition Details Module

Functional full stack implementation of the Feedants competition details screen.

The app is intentionally small, but it is not a static mock. The React Native screen reads the competition, viewer state, remaining spots, dates, rewards, winners, referral details, and current call to action from a Node.js API backed by MongoDB.

## Stack

- React Native with Expo
- Node.js with Express
- MongoDB with Mongoose
- Atomic MongoDB updates for spot booking

## Project Structure

```text
backend/
  src/
    domain/          business rules that are easy to test
    models/          mongo collections
    services/        use cases and consistency rules
    routes/          express endpoints
    seed/            demo data
  tests/             rule tests

mobile/
  src/
    api/             api client
    components/      reusable screen sections
    hooks/           data and countdown state
    screens/         competition details screen
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
```

Start MongoDB locally, or use MongoDB Atlas by setting `MONGODB_URI`.

With Docker:

```bash
docker compose up -d mongo
```

Seed the demo competition:

```bash
npm run seed
```

Start the backend:

```bash
npm run server
```

Start the React Native app:

```bash
npm run mobile
```

Expo environment values:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_USER_ID=demo-user-1
```

For Android emulator, use:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api
```

## Where This Runs

`npm run mobile` starts the Expo dev server in the terminal and shows a QR code.

- Android emulator: have an emulator already running in Android Studio, then press `a` in the terminal. Expo installs and opens the app in it.
- iOS simulator: Mac only, have Simulator open, then press `i` in the terminal.
- Physical device: install the Expo Go app, then scan the QR code with it. The device and your computer must be on the same wifi network, and `EXPO_PUBLIC_API_URL` must point to your computer's LAN IP instead of localhost or 10.0.2.2, for example `http://192.168.1.5:4000/api`.

Note: the physical device path is not recommended. tt depends on both devices being on the same network and no firewall blocking the connection, so it does not always work. the android emulator path above is what this project was built and tested in..

## Demo Users

The seed creates one registered participant:

```text
demo-user-1
```

To see the registration flow, start the mobile app with a different user id:

```bash
EXPO_PUBLIC_USER_ID=demo-user-2 npm run mobile
```

## API

```text
GET    /api/health
GET    /api/competitions/:slug
POST   /api/competitions/:slug/register
DELETE /api/competitions/:slug/register
POST   /api/competitions/:slug/submission
```

Write routes require:

```text
x-user-id: demo-user-1
```

## Business Rules Covered

- Competition details are loaded from MongoDB.
- Viewer state controls registered badge, cancellation, and upload actions.
- Registration is allowed only while the registration window is open.
- Submissions are allowed only for paid registered users during the submission window.
- Spots cannot go below zero or above capacity.
- A user cannot hold two active spots for the same competition.
- Submitted entries cannot be cancelled.
- Results, judging, registration closed, full, and unavailable states produce different actions.
- The countdown uses server time to reduce device clock drift.

## Data Model

`Competition`

- visible content such as title, tags, judge, dates, winners, tabs, rewards, referral, policy hints
- capacity fields: `totalSpots`, `bookedSpots`, `registeredUserIds`
- lifecycle fields under `timeline`

`Participation`

- one record per user and competition
- status: `registered`, `submitted`, `cancelled`
- payment state is stored separately from participation state

`Submission`

- one active submission per user and competition
- later uploads update the same record

## Concurrency Notes

Registration uses one atomic `findOneAndUpdate` on the competition document:

- checks the competition is published
- checks registration is still open
- checks the user is not already in `registeredUserIds`
- checks `bookedSpots < totalSpots`
- increments `bookedSpots`
- adds the user id to `registeredUserIds`

That protects the last spot when many users click at once. The participation record is written after the seat is reserved. If that second write fails, the reserved seat is released.

## Tests

Run the rule tests:

```bash
npm test
```

Run syntax checks:

```bash
npm run check
```

These tests cover lifecycle phase resolution, spot clamping, registered user actions, full competition behavior, cancellation blocking after submission, the atomic seat update query, and MongoDB schema validation.

## Dependency Audit

`npm audit --omit=dev` currently reports transitive Expo and Metro vulnerabilities. npm says the available fix requires breaking upgrades to Expo 57 and React Native 0.87. I did not force that migration because it would be a framework upgrade, not a small assignment fix. In production, I would schedule that upgrade separately and retest the native app on devices.

## Assumptions

- Authentication is represented by the `x-user-id` header to keep the assignment focused.
- Payment is mocked as paid on registration, but the model can support pending and failed payments.
- The design reference is for one competition details screen, so routing is minimal.
- Previous winner videos and judge video open as actions instead of playing inline.

## Major Decisions

- Business rules live in `backend/src/domain/competitionRules.js` so they are testable without MongoDB.
- The API returns a complete screen payload to avoid repeated mobile requests.
- The backend sends the main action as `viewer.primaryAction`, so frontend state cannot drift from server rules.
- The mobile UI is split by visible sections rather than by generic abstractions.

## Tradeoffs

- MongoDB transactions are not used because local standalone MongoDB should work.
- The atomic seat update handles the most important consistency risk. In production, a replica set transaction could help to wrap the competition and participation writes together.

## Production Improvements

- Real auth with access tokens.
- Payment provider integration and webhook based payment status updates.
- CDN backed media uploads for submissions.
- Admin tools for editing competition content and timelines.
