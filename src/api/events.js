// @flow
import Functions, { GET_EVENTS } from './functions';

export default {
  async forRange({ uid, from, to }: { uid: string, from: Date, to: Date }) {
    // HACK only works for current user
    const { data: events } = await Functions.call(GET_EVENTS, {
      data: { from, to },
    });
    return events;
  },
};
