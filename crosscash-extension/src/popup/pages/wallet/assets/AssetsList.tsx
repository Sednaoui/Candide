import { useEffect } from 'react';
import { useProvider } from 'wagmi';

import { ListGroup } from '../../../components';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../store';
import { getAssets } from '../../../store/assets/actions';
import AssetItem from './AssetItem';

const AssetsList = (): React.ReactElement => {
    const dispatch = useAppDispatch();
    const alchemyProvider = useProvider();
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    useEffect(() => {
        if (alchemyProvider && address) {
            dispatch(getAssets({ alchemyProvider, address }));
        }
    }, [alchemyProvider, address]);

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
