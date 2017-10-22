import cors from 'cors';

const middleware = cors({ origin: true });

export { middleware as cors };
