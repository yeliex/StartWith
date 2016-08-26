/**
 * Creator: yeliex
 * Project: Eagle
 * Description: sagas Manager
 */

import rootSaga from './sagas';
import { take, fork, cancel } from 'redux-saga/effects';

const sagas = [rootSaga];

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

// 测试时增加允许关闭sagas选项
function createAbortableSaga(saga) {
  if (process.env.NODE_ENV === 'development') {
    return function* main() {
      const sagaTask = yield fork(saga);
      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  }

  return saga;
}

const SagaManager = {
  startSagas(sagaMiddleware) {
    sagas.map(createAbortableSaga).forEach(saga => sagaMiddleware.run(saga));
  },
  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    });
  }
};

export default SagaManager;
