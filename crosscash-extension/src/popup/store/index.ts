import {
    createStore,
    applyMiddleware,
    AnyAction,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
    persistStore,
    persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { RootState } from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'root',
    storage,
    whiteList: ['wallet'],
};

const persistedReducer = persistReducer<RootState, AnyAction>(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware, logger),
);

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default {
    store,
    persistor,
};
