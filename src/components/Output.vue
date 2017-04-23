<template>
  <div>
    <div class='center'>
    <p class='text center'>your reccommended meeting time is:</p>
    <p class='output'>{{ from(meetings[0].start) }}<br> {{ day(meetings[0].start) }} </p>
    <p class='text'>
      For up to {{meetings[0].duration}} hours
    </p>
    <ui-button color="primary">Add to Google Calendar</ui-button>
    <br/>
    <ui-button v-if="!showAlternatives" class="alternatives" v-on:click="showAlternatives = true">show me some alternatives </ui-button>
    <div v-if="showAlternatives" style='padding-bottom:10px'>
      <p v-for="meeting in meetings.slice(1)">
        {{ from(meeting.start) }} {{ day(meeting.start) }} for up to {{ meeting.duration }} hours.
      </p>
    </div>
  </div>
  <fixed-footer></fixed-footer>
</div>

</template>

<script>
import FullHeader from './FullHeader';
import FixedFooter from './FixedFooter';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export default {
  components: {
    FullHeader,
    FixedFooter,
  },
  data() {
    return {
      showAlternatives: false,
    };
  },
  computed: {
    meetings() {
      return this.$store.state.session.meetings;
    },
  },
  methods: {
    from(iso) {
      return format(parse(iso), 'h:mm a');
    },
    day(iso) {
      return format(parse(iso), 'dddd');
    },
  },
};
</script>
<style scoped>
.center{
  display:flex;
  flex-direction: column;
  align-items: center;
}
.text{
  font-size: 20px;
}

.output{
  font-size: 30px;
  text-align: center;
}

.alternatives {
  /*padding-top:20px;*/
}
</style>
