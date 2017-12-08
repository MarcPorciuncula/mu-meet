# mu-meet

> Find a meeting time based on your team's calendars. Made for Unihack Mini 2017. Live at [mumeet.me](mumeet.me)

MUmeet is a webapp that helps you find meeting times that suit an entire team's calendars. It's targeted at new university students who need to find a time to meet with an assignment team. Instead of staring at each others' calendars or negotiating verbally, they can use MUmeet to find the times in between classes where they are all free.

## Project structure

`/build` - Frontend build config
`/src` - Frontend (Contained files can reference this path in imports with the alias `@/`)
`/src/app.js` - Entrypoint for the bundle
`/src/main.js` - Creates the Vue app
`/src/components` - Vue components that communicate only by props and are generally resuable.
`/src/views` - Vue components that are aware of the application, may access Vuex state and actions
`/src/store` - Vuex state, mutation, action, getter definitions. (UI is only to communicate with the world through Vuex actions)
`/src/api` - Code for interacting with APIs eg. Firebase Auth or Cloud Functions
`/src/router` - Route definitions
`/src/assets` - Static assets imported by UI code
`/src/util` - Random code
`/static` - Static files for web
`/dist` - Built files ready for web hosting

`/functions` - Firebase cloud functions build config
`/functions/src` - Firebase cloud functions
`/functions/src/index.js` - Entrypoint for cloud functions bundle
`/functions/src/triggers` - All function trigger declarations
`/functions/src/actions` - Tasks to be carried out by cloud function triggers
`/functions/src/middleware` - HTTPS function middlewares
`/functions/src/lib` - Any other code, business logic, API access etc.
`/functions/src/**/*.test.js` - Ava unit tests
`/functions/index.js` - Cloud functions bundle ready to be deployed

`/database.rules.json` - Firebase database access rules

## Env variables

| Variable              | Notes                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------|
| `NODE_ENV`            |                                                                                         |
| `GOOGLE_ANALYTICS_ID` |                                                                                         |
| `BUILD_ID`            | To be displayed in the client footer. If none is provided, it will display 'Test Build' |
| `SENTRY_DSN`          | For Sentry error reporting                                                              |
| `META`                | Meta information used to compile the index.html, in JSON form                           |

META must have the following fields: `title`, `author`, `descriptionLong`, `descriptionShort`, `tags`, `image`, `url`.

## Build Setup
This project uses `yarn` package manager.

``` bash
# install dependencies
yarn && cd functions && yarn && cd ..

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```

- Enable the Google Calendar API for your project
  - Visit https://console.developers.google.com/apis/dashboard
  - Select 'Enable API'
  - Find and enable Google Calendar

- Obtain OAuth 2 client credentials
  - Visit https://console.developers.google.com/apis/credentials
  - Create or edit an OAuth 2 client ID
  - Set at least one JavaScript origin and redirect URI
  - Download the credential as JSON
  - Place the file in `/secret/client.json`

## Build and Deploy

```bash
# make sure you have firebase-tools installed
npm install -g firebase-tools

# for the staging environment at https://staging.mumeet.me
firebase use staging
# ensure you have placed the correct credentials at secret/client.json
yarn build
cd functions && yarn build && cd ..
yarn deploy-all


# for production at https://mumeet.me
firebase use production
SET NODE_ENV=production
# ensure you have placed the correct credentials at secret/client.json
yarn build
cd functions && yarn build && cd ..
yarn deploy-all
```
