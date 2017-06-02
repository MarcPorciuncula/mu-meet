import nprogress from 'nprogress';
import R from 'ramda';

const state = {
  pending: [],
};

function updateProgressState(state, data) {
  Object.assign(state, data);
}

async function addProgressItem(context, item) {
  console.log('adding progress item', item.id, item.message);
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
  console.log('removing progress item', id);
  commit('updateProgressState', {
    pending: state.pending.filter(R.complement(R.propEq('id', id))),
  });
  if (state.pending.length) {
    nprogress.inc();
  } else {
    nprogress.done();
  }
}

// function setProgressState({ commit, state }, loading) {
//   if (state.loading && loading) {
//     nprogress.inc();
//   } else if (!state.loading && loading) {
//     nprogress.start();
//   } else {
//     nprogress.done();
//   }
//   commit('updateProgressState', { loading });
// }

export default {
  state,
  mutations: {
    updateProgressState,
  },
  actions: {
    // setProgressState,
    addProgressItem,
    removeProgressItem,
  },
};
