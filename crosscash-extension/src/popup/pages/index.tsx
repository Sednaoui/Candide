import { providers } from 'ethers';
import {
    MemoryRouter as Router,
    Routes as ReactRoutes,
    Route,
} from 'react-router-dom';
import { Provider as Web3Provider } from 'wagmi';

import { getEthereumNetwork } from '../../lib/helpers';
import { EVMNetwork } from '../../lib/networks';
import { useAppSelector } from '../store';
import { AuthProvider } from './auth/AuthProvider';
import {
    Login,
    RequireAuth,
} from './auth/Login';
import ImportWallet from './onboarding/ImportWallet';
import Welcome from './onboarding/Welcome';
import Send from './transactions/send/Send';
import AssetView from './wallet/assets/AssetView';
import Wallet from './wallet/Wallet';

export const Routes = () => {
    const provider = ({ chainID }: EVMNetwork) => new providers.AlchemyProvider(
        chainID,
        process.env.REACT_APP_ALCHEMY_API_KEY,
    );

    const currentChainID = useAppSelector((state) => state.settings.currentNetworkChainId);

    const ethNetwork = getEthereumNetwork(currentChainID);

    return (
        <Web3Provider provider={provider(ethNetwork)}>
            <Router>
                <AuthProvider>
                    <ReactRoutes>
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
                    </ReactRoutes>
                </AuthProvider>
            </Router>
        </Web3Provider>
    );
};
