const client = require('webpack-hot-middleware/client?reload=true');

client.subscribe(event => {
  if (event.action === 'reload') {
    window.location.reload();
  }
});
