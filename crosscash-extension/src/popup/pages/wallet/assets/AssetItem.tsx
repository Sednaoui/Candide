import { Link } from 'react-router-dom';

import { AnyAssetAmount } from '../../../../lib/assets';
import { unkownAssetLogo } from '../../../../lib/constants/assets';
import {
    ListGroupItem,
    Row,
    Col,
    Image,
} from '../../../components';

type AssetItemProps = {
    assetItem: AnyAssetAmount;
}

const AssetItem = ({ assetItem }: AssetItemProps): React.ReactElement => (
    <Link
        to={`/wallet/${assetItem.asset.symbol}`}
        {...assetItem}
        state={{ assetItem }}
        style={{
            textDecoration: 'none',
        }}>
        <ListGroupItem
            action
            key={assetItem.asset.symbol}>
            <Row>
                <Col>
                    <Image
                        width="35"
                        height="35"
                        roundedCircle
                        src={assetItem.asset.metadata?.logoURL || unkownAssetLogo} />
                </Col>
                <Col>
                    {assetItem.amount}
                </Col>
                <Col>
                    {assetItem.asset.symbol}
                </Col>
            </Row>
        </ListGroupItem>
    </Link>
);

export default AssetItem;
