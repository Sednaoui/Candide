import { providers } from 'ethers';
import { Provider as ReduxProvider } from 'react-redux';
import {
    MemoryRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as Web3Provider } from 'wagmi';

import './index.css';
import { ROPSTEN } from '../util/constants/networks';
import { EVMNetwork } from '../util/networks';
import { ALCHEMY_API_KEY } from './model/constants';
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

const App = (): React.ReactElement => {
    const provider = ({ name }: EVMNetwork) => new providers.AlchemyProvider(
        name.toLocaleLowerCase(),
        ALCHEMY_API_KEY,
    );

    return (
        <ReduxProvider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
                <Web3Provider provider={provider(ROPSTEN)}>
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
                </Web3Provider>
            </PersistGate>
        </ReduxProvider>
    );
};

export default App;
