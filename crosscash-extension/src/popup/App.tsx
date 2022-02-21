import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';
import { Routes } from './pages';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): React.ReactElement => (
    <ReduxProvider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
            <Routes />
        </PersistGate>
    </ReduxProvider>
);

export default App;
