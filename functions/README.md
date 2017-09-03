MUmeet cloud functions
---

Server side functionality for MUmeet, namely
- Auth
- Interacting with the Google Calendar API
- Meeting scheduling

### Project structure
`triggers.js` registers triggers and handlers for all cloud functions.

Functions that run in response to a http request define their handlers in `middleware`, otherwise, their handlers live in `actions`.

### Build

```bash
yarn build
```

Google Cloud Functions currently runs on Node 6, so all code is bundled and transpiled with `babel-preset-env` to enable the latest JavaScript features.

### Deploy

Deploying the outer repository will also deploy cloud functions.

To deploy only cloud functions:
- Make sure the outer repository is configured to deploy to your Firebase project.
- Ensure Google API client credentials are placed at `/secret/client.json` from the project root
- `yarn deploy`
