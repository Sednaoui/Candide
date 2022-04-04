import { useEffect } from 'react';

import { ListGroup } from '../../../components';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../store';
import { getAssets } from '../../../store/assets/actions';
import { useWalletProvider } from '../../../store/hooks';
import AssetItem from './AssetItem';

const AssetsList = (): React.ReactElement => {
    const dispatch = useAppDispatch();
    const provider = useWalletProvider();
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    useEffect(() => {
        if (provider && address) {
            dispatch(getAssets({ alchemyProvider: provider, address }));
        }
    }, [provider, address]);

    const assetsList = useAppSelector((state) => state.assets.assets);

    return (
        <ListGroup>
            {assetsList.map((assetAmount) => (
                <AssetItem
                    key={assetAmount.asset.symbol}
                    assetItem={assetAmount} />
            ))}
        </ListGroup>
    );
};

export default AssetsList;
