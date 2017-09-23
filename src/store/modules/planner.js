import Planner from '@/api/planner';
import Events from '@/api/events';
import {
  UPDATE_PLANNER_SESSION,
  UPDATE_PLANNER_EVENTS,
} from '@/store/mutations';
import {
  SUBSCRIBE_PLANNER_SESSION,
  CREATE_PLANNER_SESSION,
  JOIN_PLANNER_SESSION,
  ARCHIVE_PLANNER_SESSION,
  REQUEST_PLANNER_RESULT,
  SET_PLANNER_CONFIG,
  START_PROGRESS_ITEM,
  FINISH_PROGRESS_ITEM,
  FETCH_PLANNER_EVENTS,
  RESET_PLANNER,
} from '@/store/actions';
import {
  USER_UID,
  IS_IN_PLANNER_SESSION,
  CURRENT_PLANNER_SESSION,
  CURRENT_PLANNER_EVENTS,
} from '@/store/getters';

const state = {
  session: null,
  events: [],
};

const mutations = {
  [UPDATE_PLANNER_SESSION](state, session) {
    if (state.session) {
      Object.assign(state.session, session);
    } else {
      state.session = session;
    }
  },
  [UPDATE_PLANNER_EVENTS](state, events) {
    state.events = events;
  },
};

let subscriptions;

const actions = {
  async [SUBSCRIBE_PLANNER_SESSION]({ commit, dispatch, state, getters }) {
    const id = await Planner.forUser(getters[USER_UID]);
    if (id) {
      const session = await Planner.get(id);
      commit(UPDATE_PLANNER_SESSION, Object.assign(session, { id }));
      if (state.session.result.status === 'DONE') {
        dispatch(FETCH_PLANNER_EVENTS);
      }
    } else {
      commit(UPDATE_PLANNER_SESSION, null);
      return;
    }

    if (subscriptions) {
      for (let subscription of Object.values(subscriptions)) {
        subscription.unsubscribe();
      }
    }

    const { users, result, config } = Planner.subscribe(id);
    subscriptions = {
      users: users.subscribe({
        next: value => commit(UPDATE_PLANNER_SESSION, { users: value }),
      }),
      result: result.subscribe({
        next: value => {
          if (
            state.session.result.status !== 'DONE' &&
            value.status === 'DONE'
          ) {
            dispatch(FETCH_PLANNER_EVENTS);
          }
          commit(UPDATE_PLANNER_SESSION, { result: value });
        },
      }),
      config: config.subscribe({
        next: value => commit(UPDATE_PLANNER_SESSION, { config: value }),
      }),
    };
  },
  async [CREATE_PLANNER_SESSION]({
    commit,
    redirect,
    state,
    getters,
    dispatch,
  }) {
    dispatch(START_PROGRESS_ITEM, {
      type: CREATE_PLANNER_SESSION,
      message: 'Creating meeting plan',
    });

    await Planner.create();

    dispatch(FINISH_PROGRESS_ITEM, {
      type: CREATE_PLANNER_SESSION,
    });
  },
  async [JOIN_PLANNER_SESSION]({ state, getters, dispatch }, { id }) {
    dispatch(START_PROGRESS_ITEM, {
      type: JOIN_PLANNER_SESSION,
      message: 'Joining meeting plan ' + id,
    });

    const uid = getters[USER_UID];
    await Planner.join({ id, uid });

    dispatch(FINISH_PROGRESS_ITEM, {
      type: JOIN_PLANNER_SESSION,
    });
  },
  async [ARCHIVE_PLANNER_SESSION]({ state, getters }) {
    const id = state.session.id;
    const uid = getters[USER_UID];

    await Planner.archive({ uid, id });
  },
  async [REQUEST_PLANNER_RESULT]({ dispatch, state }) {
    dispatch(START_PROGRESS_ITEM, {
      type: REQUEST_PLANNER_RESULT,
      message: 'Finding meeting times',
    });

    await Planner.result(state.session.id);

    dispatch(FINISH_PROGRESS_ITEM, {
      type: REQUEST_PLANNER_RESULT,
    });
  },
  async [SET_PLANNER_CONFIG]({ state, commit, dispatch }, patch) {
    dispatch(START_PROGRESS_ITEM, {
      type: SET_PLANNER_CONFIG,
      message: 'Updating meeting parameters',
    });

    const config = Object.assign({}, state.session.config, patch);
    commit(
      UPDATE_PLANNER_SESSION,
      Object.assign({}, state.session, { config }),
    );

    await Planner.update(state.session.id, { config: patch });

    dispatch(FINISH_PROGRESS_ITEM, {
      type: SET_PLANNER_CONFIG,
    });
  },
  async [FETCH_PLANNER_EVENTS]({ commit, dispatch, getters, state }) {
    const { searchFromDate: from, searchToDate: to } = state.session.config;
    const uid = getters[USER_UID];
    const events = await Events.forRange({ uid, from, to });
    commit(UPDATE_PLANNER_EVENTS, events);
  },
  [RESET_PLANNER]({ commit }) {
    if (subscriptions) {
      for (let subscription of Object.values(subscriptions)) {
        subscription.unsubscribe();
      }
    }
    commit(UPDATE_PLANNER_EVENTS, []);
    commit(UPDATE_PLANNER_SESSION, null);
  },
};

const getters = {
  [IS_IN_PLANNER_SESSION](state) {
    return !!state.session;
  },
  [CURRENT_PLANNER_SESSION](state) {
    return state.session;
  },
  [CURRENT_PLANNER_EVENTS](state) {
    return state.events;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
