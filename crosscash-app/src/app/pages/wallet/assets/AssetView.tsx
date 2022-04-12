import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import { unkownAssetLogo } from '../../../../lib/constants/assets';
import {
    Stack,
    Image,
    CloseButton,
    Button,
} from '../../../components';
import { useAppSelector } from '../../../store';

export const AssetView = (): React.ReactElement => {
    const { assetSymbol } = useParams<'assetSymbol'>();

    const assetItem = useAppSelector((state) =>
        state.assets.assets.find((element) => element.asset.symbol === assetSymbol));

    const navigate = useNavigate();

    return (
        <div>
            <header className="App-header">
                <Stack gap={2}>
                    <CloseButton />
                    <Image
                        width="60"
                        height="60"
                        roundedCircle
                        src={assetItem?.asset.metadata?.logoURL || unkownAssetLogo} />
                    {assetItem?.amount}
                    {' '}
                    {assetItem?.asset.symbol}
                    <Button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            navigate(`/send/${assetItem?.asset.symbol}`);
                        }}>
                        Send
                    </Button>
                </Stack>
            </header>
        </div>
    );
};

export default AssetView;
