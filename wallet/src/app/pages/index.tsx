import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    MemoryRouter as Router,
    Routes as ReactRoutes,
    Route,
} from 'react-router-dom';

import { initiateNewProvider } from '../../lib/alchemy';
import { getEthereumNetwork } from '../../lib/helpers';
import Layout from '../components/Layout/Layout';
import { useAppSelector } from '../store';
import {
    initiateWalletProvider,
    resetTempWalletState,
    initiateDappProvider,
} from '../store/wallet/actions';
import { AuthProvider } from './auth/AuthProvider';
import ConnectWallet from './connections/ConnectWallet';
import ImportWallet from './onboarding/ImportWallet';
import Welcome from './onboarding/Welcome';
import Settings from './settings/Settings';
import Send from './transactions/send/Send';
import AssetView from './wallet/assets/AssetView';
import Wallet from './wallet/Wallet';

export const Routes = () => {
    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);
    const dappChainId = useAppSelector((state) => state.wallet.dappChainId);

    const ethNetwork = getEthereumNetwork(walletChainId);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initiateWalletProvider(initiateNewProvider(
            ethNetwork,
            process.env.REACT_APP_ALCHEMY_API_KEY,
        )));
    }, [initiateNewProvider, ethNetwork, dispatch, initiateWalletProvider]);

    useEffect(() => {
        if (dappChainId) {
            const network = getEthereumNetwork(dappChainId);

            dispatch(initiateDappProvider(initiateNewProvider(
                network,
                process.env.REACT_APP_ALCHEMY_API_KEY,
            )));
        }
    }, [dappChainId]);

    useEffect(() => {
        dispatch(resetTempWalletState());
    }, []);

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);

    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <ReactRoutes>
                        <Route path="/" element={!walletInstance ? <Welcome /> : <Wallet />} />
                        <Route path="import_wallet" element={<ImportWallet />} />
                        <Route path="/send/:assetSymbol" element={<Send />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/wallet/:assetSymbol" element={<AssetView />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/walletconnect" element={<ConnectWallet />} />
                    </ReactRoutes>
                </Layout>
            </AuthProvider>
        </Router>
    );
};
