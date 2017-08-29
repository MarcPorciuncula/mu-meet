import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

if (process.env.NODE_ENV === 'production') {
  const build = process.env.BUILD_ID;
  const dsn = process.env.SENTRY_DSN;

  let activate = true;
  if (!build) {
    activate = false;
    console.warn('No BUILD_ID was supplied. Error reporting is disabled.');
  }

  if (!dsn) {
    activate = false;
    console.warn('No SENTRY_DSN was supplied. Error reporting is disabled.');
  }

  if (activate) {
    console.info('Release Version:', build);
    console.info('Activating Sentry error reporting.');

    Raven.config(dsn, {
      release: build,
    })
      .addPlugin(RavenVue, Vue)
      .install();
  }
}
