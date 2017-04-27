<template>
  <page>
    <p>
      <mumeet-logo></mumeet-logo> uses your Google Calendar to check your schedule.
    </p>
    <p>
      which calendars would you like to schedule around?
    </p>
    <p>
      ready to begin?
    </p>
    <user-action>
      continue
    </user-action>
  </page>
</template>

<script>
import Page from './Page';
import MumeetLogo from './MumeetLogo';
import UserAction from './UserAction';

export default {
  components: {
    Page,
    MumeetLogo,
    UserAction,
  },
};
</script>
