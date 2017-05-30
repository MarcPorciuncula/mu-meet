# mu-meet

> Find a meeting time based on your team's calendars. Made for Unihack Mini 2017. Live at [mumeet.surge.sh](mumeet.surge.sh)

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```
This project was bootstrapped with the Vue Webpack template. For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

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

# for the staging environment at https://mumeet-staging.herokuapp.com

firebase use staging
# ensure you have placed the correct credentials at secret/client.json
yarn build
cd functions && yarn build && cd ..
yarn deploy-all


# for production at http://mumeet.surge.sh
firebase use production
SET NODE_ENV=production
# ensure you have placed the correct credentials at secret/client.json
# hosting
yarn build
surge -p dist -d https://mumeet.surge.sh
# database rules
yarn deploy-database
# functions
cd functions
yarn build
yarn deploy
```
