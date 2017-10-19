// Disable native promises, (the webpack config will polyfill them back in)
// Native promises do not support the unhandledrejection event, so we need to use
// the polyfilled version to track unhandled promise rejections
if (process.env.NODE_ENV === 'production' && window.Promise) {
  console.debug(
    `This browser provides a native Promise. I'm disabling it to force use of core-js to allow "onunhandledrejection".`,
  );
  delete window.Promise;

  const Promise = require('core-js/library/es6/promise');
  window.Promise = Promise;
}
