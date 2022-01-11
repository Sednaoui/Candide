import { Provider } from 'react-redux';
import {
    MemoryRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';
import { AuthProvider } from './pages/auth/AuthProvider';
import {
    RequireAuth,
    Login,
} from './pages/auth/Login';
import ImportWallet from './pages/onboarding/ImportWallet';
import Welcome from './pages/onboarding/Welcome';
import Send from './pages/transactions/send/Send';
import Wallet from './pages/wallet/Wallet';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): React.ReactElement => (
    <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="import_wallet" element={<ImportWallet />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/send" element={<Send />} />
                        <Route
                            path="/wallet"
                            element={(
                                <RequireAuth>
                                    <Wallet />
                                </RequireAuth>
                            )} />
                    </Routes>
                </AuthProvider>
            </Router>
        </PersistGate>
    </Provider>
);

export default App;
