# Project Summary — nodejs-ecms

This document summarizes the codebase analysis performed so far (architecture, flow, key modules, and notable observations). Use this as a concise reference while working on the project.

**Overview**
- Purpose: An Express + Mongoose API that manages shop accounts, API keys, and JWT tokens (access + refresh). Routes are protected by API keys and permission checks. Shops can sign up and receive JWT tokens which are persisted as refresh tokens.

**High-level architecture & flow**
- App start: [src/index.ts](src/index.ts) initializes Express, middleware, mounts routers, connects MongoDB and starts the server.
- Request protection: Global middleware from [src/utils/checkAuth.ts](src/utils/checkAuth.ts) verifies an `x-api-key` header via the API-key service and enforces a permission string.
- Business flow (signup): Client calls `POST /v1/api/shop/signup` -> controller [src/controllers/access.controllers.ts](src/controllers/access.controllers.ts) -> service [src/services/access.services.ts](src/services/access.services.ts) -> creates shop, issues JWTs ([src/auth/authUtil.ts](src/auth/authUtil.ts)), stores refresh token via [src/services/keyToken.services.ts](src/services/keyToken.services.ts).
- Data storage: Mongoose models in [src/models](src/models) map to collections defined in [src/types/const/const.ts](src/types/const/const.ts).

**Key files (short descriptions)**
- [src/index.ts](src/index.ts): App entrypoint, middleware, server lifecycle, error handlers.
- [src/configs/config.mongodb.ts](src/configs/config.mongodb.ts): Env-driven config selection (dev/pro) for DB and port.
- [src/db/init.mongodb.ts](src/db/init.mongodb.ts): Mongoose singleton connector using config.
- [src/helpers/connect.ts](src/helpers/connect.ts): Monitoring helpers (connection count, simple overload check).
- [src/core/error.response.ts](src/core/error.response.ts): Custom error classes (`ErrorResponse`, `BadRequestError`, etc.).
- [src/core/success.reponse.ts](src/core/success.reponse.ts): Success response wrappers (`OK`, `Created`) with static `send()` helpers.
- [src/auth/authUtil.ts](src/auth/authUtil.ts): JWT helpers — `createTokenPair(payload)` returns access + refresh tokens.
- [src/utils/checkAuth.ts](src/utils/checkAuth.ts): `apiKey` middleware, `permission()` factory, and `asyncHandler` wrapper.
- [src/utils/index.ts](src/utils/index.ts): small helper `getInfoData` (uses `lodash.pick`).
- [src/models/apiKey.models.ts](src/models/apiKey.models.ts): API keys schema (key, status, permissions).
- [src/models/shop.models.ts](src/models/shop.models.ts): Shop schema (name, email, password, status, verify, roles).
- [src/models/key.models.ts](src/models/key.models.ts): Keys schema linking user -> refreshToken.
- [src/services/access.services.ts](src/services/access.services.ts): Sign-up business logic (hash password, create shop, create tokens, persist refresh token).
- [src/services/apikey.services.ts](src/services/apikey.services.ts): Lookup for API keys (findKeyByID).
- [src/services/keyToken.services.ts](src/services/keyToken.services.ts): Persists refresh tokens in `Keys` collection.
- [src/controllers/access.controllers.ts](src/controllers/access.controllers.ts): Controller for signup route, uses `Created.send()`.
- [src/routers/index.ts](src/routers/index.ts): Top-level router applying `apiKey` and `permission('0000')`, mounts `routeAuth` under `/v1/api`.
- [src/routers/access/index.ts](src/routers/access/index.ts): Defines `POST /shop/signup`.
- [src/types/services/index.ts](src/types/services/index.ts): TypeScript types for service interfaces.
- [src/types/const/const.ts](src/types/const/const.ts): Collection and document name enums.

**Notable observations & recommended fixes**
- Password field mismatch: The sign-up service writes `passwordHash` when creating a shop, but the shop schema defines `password`. Choose one name (recommended: `passwordHash`) and update the schema or creation call to match.
- Permission enforcement: Currently the top-level router applies `permission('0000')` globally. If you want per-route permissions, move checks to specific routes instead of globally.
- `type.d.ts` is currently empty — move any global/ambient types there if needed.
- Error handling: App has generic error handler; custom `ErrorResponse` attaches `.status` which the handler uses. Consider harmonizing thrown errors with these classes for clearer responses.

**How to run (assumptions)**
- Ensure `.env` (or environment) sets at least: `MONGODB_URI` or `DEV_DB_*` vars, and `JWT_SECRET`.
- Install and run:

```bash
npm install
npm run dev   # or: node build/index.js depending on your scripts
```

- Example signup curl (adjust host/port/.env):

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: <YOUR_API_KEY>" \
  -d '{"name":"My Shop","email":"a@b.com","password":"secret"}' \
  http://localhost:3005/v1/api/shop/signup
```

**Next steps I can do for you**
- Apply the `passwordHash` vs `password` fix across schema/service and run a quick test.
- Expand the summary into a full file-by-file line-by-line walkthrough.
- Add example tests or a Postman collection for the signup flow.

---
Generated from the repository analysis performed earlier. If you want one of the "Next steps" executed now, tell me which and I'll proceed.
