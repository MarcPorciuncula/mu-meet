const client = require('webpack-hot-middleware/client?reload=true');

client.subscribe(event => {
  // HACK I disabled this as it seems to be forcing reloads when a hot update is happening.
  // if (event.action === 'reload') {
  //   window.location.reload();
  // }
});
