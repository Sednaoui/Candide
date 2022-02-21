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
import { getEthereumNetwork } from '../lib/helpers';
import { EVMNetwork } from '../lib/networks';
import { CURRENT_NETWORK } from './model/constants';
import { AuthProvider } from './pages/auth/AuthProvider';
import {
    RequireAuth,
    Login,
} from './pages/auth/Login';
import ImportWallet from './pages/onboarding/ImportWallet';
import Welcome from './pages/onboarding/Welcome';
import Send from './pages/transactions/send/Send';
import AssetView from './pages/wallet/assets/AssetView';
import Wallet from './pages/wallet/Wallet';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (): React.ReactElement => {
    const provider = ({ chainID }: EVMNetwork) => new providers.AlchemyProvider(
        chainID,
        process.env.REACT_APP_ALCHEMY_API_KEY,
    );

    const ethNetwork = getEthereumNetwork(CURRENT_NETWORK.chainID);

    return (
        <ReduxProvider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
                <Web3Provider provider={provider(ethNetwork)}>
                    <Router>
                        <AuthProvider>
                            <Routes>
                                <Route path="/" element={<Welcome />} />
                                <Route path="import_wallet" element={<ImportWallet />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/send/:assetSymbol" element={<Send />} />
                                <Route
                                    path="/wallet"
                                    element={(
                                        <RequireAuth>
                                            <Wallet />
                                        </RequireAuth>
                                    )} />
                                <Route path="/wallet/:assetSymbol" element={<AssetView />} />
                            </Routes>
                        </AuthProvider>
                    </Router>
                </Web3Provider>
            </PersistGate>
        </ReduxProvider>
    );
};

export default App;
