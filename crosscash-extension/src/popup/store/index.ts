import {
    createStore,
    applyMiddleware,
    AnyAction,
} from '@reduxjs/toolkit';
import {
    useSelector,
    useDispatch,
    TypedUseSelectorHook,
} from 'react-redux';
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
    whiteList: ['wallet', 'settingsReducer'],
    blacklist: ['assets', 'transactions'],
};

const persistedReducer = persistReducer<RootState, AnyAction>(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware, logger),
);

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// typed redux hooks to avoid typing userSelector and useDispatch throughout the app
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default {
    store,
    persistor,
};
