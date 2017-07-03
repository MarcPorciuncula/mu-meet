import TeamList from './TeamList';
import { CURRENT_PLANNER_SESSION } from '@/store/getters';

export default {
  name: 'ConnectedTeamList',
  render(h) {
    return h(TeamList, {
      props: {
        members: this.members,
      },
    });
  },
  computed: {
    members() {
      const session = this.$store.getters[CURRENT_PLANNER_SESSION];
      return (session && session.users) || [];
    },
  },
};
