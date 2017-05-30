import nprogress from 'nprogress';

const state = {
  loading: false,
};

function updateProgressState(state, data) {
  Object.assign(state, data);
}

function setProgressState({ commit, state }, loading) {
  if (state.loading && loading) {
    nprogress.inc();
  } else if (!state.loading && loading) {
    nprogress.start();
  } else {
    nprogress.done();
  }
  commit('updateProgressState', { loading });
}

export default {
  state,
  mutations: {
    updateProgressState,
  },
  actions: {
    setProgressState,
  },
};
