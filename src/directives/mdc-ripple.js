/* eslint-disable no-new */
import { MDCRipple } from '@material/ripple';
import './mdc-ripple.scss';

export default {
  inserted(el) {
    const ripple = new MDCRipple(el);
    el.classList.add('mdc-ripple');
    el.ripple = ripple;
  },
  update(el) {
    el.classList.add('mdc-ripple');
  },
  unbind(el) {
    el.ripple.destroy();
  },
};
