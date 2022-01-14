import { AnyAssetAmount } from '../../../../lib/assets';
import {
    ListGroupItem,
    Row,
    Col,
    Image,
} from '../../../components';

const unkownAssetLogo = 'https://www.themoviethemesong.com/wp-content/uploads/2014/07/Wallace-and-Gromit-5.jpg';

type AssetItemProps = {
    assetItem: AnyAssetAmount;
}

const AssetItem = ({ assetItem }: AssetItemProps): React.ReactElement => (
    <ListGroupItem
        action
        key={assetItem.asset.symbol}
        onClick={(): void => console.log(assetItem)}>
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
);

export default AssetItem;
