import { mapState } from 'vuex';
import R from 'ramda';
import TeamList from './TeamList';

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
    ...mapState({
      members: state =>
        R.compose(
          R.map(([uid, user]) =>
            Object.assign({}, user, state.users.users[uid], { id: uid }),
          ),
          R.filter(([uid]) => state.users.users[uid]),
          R.toPairs,
          R.path(['meet', 'session', 'users']),
        )(state),
    }),
  },
};
