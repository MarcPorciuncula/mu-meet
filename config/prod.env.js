module.exports = {
  NODE_ENV: '"production"',
  STAGING: `${process.env.NODE_ENV === 'production' ? 'false' : 'true'}`,
}
