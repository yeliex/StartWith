import { handleActions } from 'redux-actions';
import Types from '../types';

const window = handleActions({
  [Types.WINDOW_TITLE](state, { title }) {
    if (title) {
      if (document.title) {
        document.title = title;
      }
      return { ...state, title };
    }
    return state;
  },
  [Types.WINDOW_SIDEBAR](state) {
    return { ...state, sidebar: !state.sidebar }
  }
}, {
  title: 'WXServices',
  sidebar: false
});

export default window;
