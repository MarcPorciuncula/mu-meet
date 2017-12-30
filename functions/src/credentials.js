export default preval`
  const fs = require('fs-extra');
  const path = require('path');
  module.exports = fs.readJsonSync(path.join(__dirname, '../../secret/client.json'));
`;
