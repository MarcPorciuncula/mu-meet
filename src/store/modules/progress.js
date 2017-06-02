import nprogress from 'nprogress';
import R from 'ramda';

const state = {
  pending: [],
};

function updateProgressState(state, data) {
  Object.assign(state, data);
}

async function addProgressItem(context, item) {
  const { commit, state } = context;
  if (!state.pending.length) {
    nprogress.start();
  }
  if (state.pending.find(R.propEq('type', item.type))) {
    return;
  }
  commit('updateProgressState', {
    pending: [...state.pending, item],
  });
  if (item.done) {
    await item.done;
    removeProgressItem(context, item.id);
  }
}

function removeProgressItem({ commit, state }, id) {
  commit('updateProgressState', {
    pending: state.pending.filter(R.complement(R.propEq('id', id))),
  });
  if (state.pending.length) {
    nprogress.inc();
  } else {
    nprogress.done();
  }
}

function updateProgressItem({ commit, state }, { id, message }) {
  commit('updateProgressState', {
    pending: state.pending.map(
      R.when(
        R.both(R.propEq('id', id), R.always(message)),
        R.assoc('message', message),
      ),
    ),
  });
  nprogress.inc();
}

export default {
  state,
  mutations: {
    updateProgressState,
  },
  actions: {
    addProgressItem,
    updateProgressItem,
    removeProgressItem,
  },
};
