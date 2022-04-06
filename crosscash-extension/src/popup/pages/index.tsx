import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    MemoryRouter as Router,
    Routes as ReactRoutes,
    Route,
} from 'react-router-dom';

import { initiateNewProvider } from '../../lib/alchemy';
import { getEthereumNetwork } from '../../lib/helpers';
import { useAppSelector } from '../store';
import { initiateWalletProvider } from '../store/wallet/actions';
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
    const currentChainID = useAppSelector((state) => state.wallet.currentNetworkChainId);

    const ethNetwork = getEthereumNetwork(currentChainID);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initiateWalletProvider(initiateNewProvider(
            ethNetwork,
            process.env.REACT_APP_ALCHEMY_API_KEY,
        )));
    }, [initiateNewProvider, ethNetwork, dispatch, initiateWalletProvider]);

    return (
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
    );
};
